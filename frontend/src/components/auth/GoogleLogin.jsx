import { useState } from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Slide from "@mui/material/Slide";
import CircularProgress from "@mui/material/CircularProgress";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";

const SlideTransition = (props) => <Slide {...props} direction="up" />;

const GoogleSignIn = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info", // success, error, warning, info
    title: ""
  });

  // Replace with your actual backend URL and Google Client ID
  const API_BASE_URL = "http://localhost:8080"; // Example backend
  const CLIENT_ID = "1025016492889-4nqijfrnvqq3ropo7bo0umhtk3um5i90.apps.googleusercontent.com";

  const showAlert = (message, severity = "info", title = "") => {
    setSnackbar({ open: true, message, severity, title });
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const getAlertIcon = (severity) => {
    switch (severity) {
      case 'success': return <CheckCircle className="w-5 h-5" />;
      case 'error': return <XCircle className="w-5 h-5" />;
      case 'warning': return <AlertCircle className="w-5 h-5" />;
      default: return <AlertCircle className="w-5 h-5" />;
    }
  };

  const handleGoogleSuccess = async (response) => {
    try {
      setLoading(true);
      showAlert("Authenticating with Google...", "info", "Signing In");

      const backendResponse = await axios.post(
        `${API_BASE_URL}/api/auth/google`,
        { token: response.credential, requestCalendarAccess: true }
      );
      const data = backendResponse.data;
      console.log(data);
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token);
      localStorage.setItem('user_email', data.email);
      localStorage.setItem('user_name', data.name);
      localStorage.setItem('user_roles', JSON.stringify(data.roles));
      localStorage.setItem('user_id', data.id);

      if (data.roles.includes('STUDENT')) navigate('/dashboard');
      else if (data.roles.includes('STAFF')) navigate('/staff');
      else navigate('/dashboard');

    } catch (error) {
      console.error("Google login failed:", error);
      showAlert(
        error.response?.data?.message || "Failed to sign in with Google. Please try again.",
        "error",
        "Sign In Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    showAlert(
      "Google sign-in was cancelled or failed. Please try again.",
      "error",
      "Sign In Error"
    );
  };

  return (
    <div className="relative">
      {loading && (
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-sm rounded-xl flex items-center justify-center z-10">
          <div className="bg-gradient-to-br from-[#130b3b]/95 to-[#1a0f4a]/95 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/30 shadow-2xl shadow-purple-500/20">
            <div className="flex items-center space-x-3">
              <CircularProgress size={24} sx={{ color: '#a855f7', '& .MuiCircularProgress-circle': { strokeLinecap: 'round' } }} />
              <span className="text-white font-medium">Signing you in...</span>
            </div>
          </div>
        </div>
      )}

      <GoogleOAuthProvider clientId={CLIENT_ID}>
        <div className={`transition-opacity duration-300 ${loading ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            useOneTap
            scope="email profile https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events"
            access_type="offline"
            prompt="consent"
          />
        </div>
      </GoogleOAuthProvider>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        TransitionComponent={SlideTransition}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        sx={{ '& .MuiSnackbarContent-root': { background: 'transparent', boxShadow: 'none', padding: 0 } }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          icon={getAlertIcon(snackbar.severity)}
          sx={{
            background: snackbar.severity === 'success'
              ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.9), rgba(21, 128, 61, 0.9))'
              : snackbar.severity === 'error'
              ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.9), rgba(185, 28, 28, 0.9))'
              : snackbar.severity === 'warning'
              ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.9), rgba(180, 83, 9, 0.9))'
              : 'linear-gradient(135deg, rgba(147, 51, 234, 0.9), rgba(126, 34, 206, 0.9))',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '16px',
            color: 'white',
            minWidth: '350px',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
            '& .MuiAlert-icon': { color: 'white' },
            '& .MuiAlert-action .MuiIconButton-root': { color: 'white', '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }
          }}
        >
          {snackbar.title && <AlertTitle sx={{ fontWeight: 'bold', marginBottom: '4px', color: 'white' }}>{snackbar.title}</AlertTitle>}
          <div style={{ fontSize: '14px', lineHeight: '1.4', color: 'rgba(255, 255, 255, 0.95)' }}>
            {snackbar.message}
          </div>
        </Alert>
      </Snackbar>
    </div>
  );
};

export default GoogleSignIn;
