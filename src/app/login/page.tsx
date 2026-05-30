import LoginForm from '../../components/auth/LoginForm';

interface LoginPageProps {
  onToggleForm: () => void;
  onSuccess: () => void;
}

export default function LoginPage({ onToggleForm, onSuccess }: LoginPageProps) {
  return (
    <div className="min-h-screen bg-[#07060b] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient background stadium lights */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[300px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[300px] bg-purple-500/10 blur-[120px] rounded-full pointer-events-none" />
      
      {/* Pitch tactical grid elements */}
      <div className="absolute inset-0 bg-black/10 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-40" />

      <LoginForm onToggleForm={onToggleForm} onSuccess={onSuccess} />
    </div>
  );
}
