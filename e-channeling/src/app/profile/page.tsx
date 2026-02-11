// src/app/profile/page.tsx
import { redirect } from 'next/navigation';

export default function ProfilePage() {
  // Redirect to appointments by default
  redirect('/profile/appointments ');
  
  return null;
}