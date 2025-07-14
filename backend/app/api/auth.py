from fastapi import APIRouter, HTTPException, Depends
from supabase import Client
from app.database import get_supabase
from app.models.user import UserProfile, UserProfileCreate, UserProfileUpdate
from typing import Optional

router = APIRouter()

def get_current_user_id(token: str = None) -> str:
    if not token:
        raise HTTPException(status_code=401, detail="Authentication required")
    return "user_id_placeholder"

@router.post("/signup")
async def signup(email: str, password: str, supabase: Client = Depends(get_supabase)):
    try:
        response = supabase.auth.sign_up({
            "email": email,
            "password": password
        })
        
        if response.user:
            profile_data = {
                "id": response.user.id,
                "display_name": email.split("@")[0]
            }
            
            supabase.table("user_profiles").insert(profile_data).execute()
            
            return {"message": "User created successfully", "user": response.user}
        else:
            raise HTTPException(status_code=400, detail="Failed to create user")
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/login")
async def login(email: str, password: str, supabase: Client = Depends(get_supabase)):
    try:
        response = supabase.auth.sign_in_with_password({
            "email": email,
            "password": password
        })
        
        if response.user:
            return {"message": "Login successful", "user": response.user, "session": response.session}
        else:
            raise HTTPException(status_code=401, detail="Invalid credentials")
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))

@router.post("/logout")
async def logout(supabase: Client = Depends(get_supabase)):
    try:
        supabase.auth.sign_out()
        return {"message": "Logout successful"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/me")
async def get_current_user(
    user_id: str = Depends(get_current_user_id),
    supabase: Client = Depends(get_supabase)
):
    try:
        response = supabase.table("user_profiles").select("*").eq("id", user_id).execute()
        
        if response.data:
            return response.data[0]
        else:
            raise HTTPException(status_code=404, detail="User profile not found")
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/profile")
async def update_profile(
    profile_update: UserProfileUpdate,
    user_id: str = Depends(get_current_user_id),
    supabase: Client = Depends(get_supabase)
):
    try:
        update_data = profile_update.dict(exclude_unset=True)
        update_data["updated_at"] = "now()"
        
        response = supabase.table("user_profiles").update(update_data).eq("id", user_id).execute()
        
        if response.data:
            return response.data[0]
        else:
            raise HTTPException(status_code=404, detail="User profile not found")
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))