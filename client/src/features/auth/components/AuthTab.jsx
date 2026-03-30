const AuthTabs = ({ isLogin, setIsLogin }) => {
  const baseTabClass = "flex-1 py-3 text-sm font-bold uppercase tracking-[0.2em] transition-colors duration-150";
  const activeClass = "bg-text-primary text-white";
  const inactiveClass = "bg-white text-text-secondary hover:bg-surface";

  return (
    <div className="flex gap-0 mb-8 border border-border">
      <button
        data-testid="login-tab"
        onClick={() => setIsLogin(true)}
        className={`${baseTabClass} ${isLogin ? activeClass : inactiveClass}`}
      >
        Login
      </button>
      <button
        data-testid="signup-tab"
        onClick={() => setIsLogin(false)}
        className={`${baseTabClass} ${!isLogin ? activeClass : inactiveClass}`}
      >
        Sign Up
      </button>
    </div>
  );
};

export default AuthTabs;