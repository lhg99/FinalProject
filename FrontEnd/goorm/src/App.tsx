import React from 'react';
import { BrowserRouter, Route, Routes, Outlet } from 'react-router-dom';
import Header from './components/Header/Header';
import Chat from './pages/Chat/components/Chat';
import FloatingButtonWithChat from './pages/Chat/components/FloatingButtonWithChat';
import Exercise from './pages/Exercise/Exercise';
import Map from './pages/FindGym/Map/Map';
import Login from './pages/Login/Login';
import SignUp from './pages/SignUp/SignUp';
import Main from './pages/MyPage/Main/Main';
import MyPage from './pages/MyPage/MyPage/MyPage';
import MyPageEdit from './pages/MyPage/MyPage/MyPageEdit';
import { AuthProvider } from './pages/Login/auth/AuthContext';
import ProtectedRoute from './pages/Login/auth/ProtectedRoute';
import ExerciseVideo from './pages/HealthVideo/ExerciseVideo/ExerciseVideo';

const Layout: React.FC = () => (
  <>
    <Header />
    <main>
      <Outlet />
    </main>
    <FloatingButtonWithChat />
  </>
);

const App: React.FC = () => {
  const initialUsername = "현재 사용자명";
  const initialComment = "현재 사용자 소개";

  const handleUpdate = () => {
    console.log("업데이트가 완료되었습니다.");
  };

  return (
    <AuthProvider>
      <BrowserRouter>
      <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route element={<Layout />}>
            <Route path="/" element={<h1>Welcome to MyWebsite</h1>} />
            <Route path="/chat" 
              element={
                <ProtectedRoute>
                  <Chat />
                </ProtectedRoute>
              } 
            />
            <Route path="/exercise" 
              element={
                <ProtectedRoute>
                  <Exercise />
                </ProtectedRoute>
              } 
            />
            <Route path="/findgym" 
              element={
                <ProtectedRoute>
                  <Map />
                </ProtectedRoute>
              } 
            />
            <Route path="/main" 
              element={
                <ProtectedRoute>
                  <Main />
                </ProtectedRoute>
              } 
            />
              <Route path="/mypage" 
              element={
                <ProtectedRoute>
                  <MyPage />
                </ProtectedRoute>
              } 
            />
            <Route path="/exvideo" 
              element={
                <ProtectedRoute>
                  <ExerciseVideo />
                </ProtectedRoute>
              } 
            />
            <Route path="/edit" 
              element={
                <ProtectedRoute>
                  <MyPageEdit
                    initialUsername={initialUsername}
                    initialComment={initialComment}
                    onUpdate={handleUpdate}
                  />
                </ProtectedRoute>
              } 
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;