import { useNavigate } from "react-router-dom";
import { WelcomeScreen } from "@/components/WelcomeScreen";

export default function Home() {
  const navigate = useNavigate();

  return (
    <WelcomeScreen 
      onGetStarted={() => navigate("/cities")} 
    />
  );
}
