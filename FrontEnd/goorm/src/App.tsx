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
import { AuthProvider } from './pages/Login/auth/AuthContext';
import ProtectedRoute from './pages/Login/auth/ProtectedRoute';
import Food from './pages/Food/Food';
import FreeBoardPage from './pages/Board/page/FreeBoard/FreeBoardPage';
import DetailPost from './pages/Board/Post/DetailPost';
import UpdatePost from './pages/Board/Post/UpdatePost';
import CreatePost from './pages/Board/Post/CreatePost';
import ExerciseChartPage from './pages/Chart/ExerciseChart/ExerciseChartPage';
import ExerciseRecordPage from './pages/Exercise/components/ExerciseRecordList/ExerciseRecordPage';
import ExerciseVideo from './pages/HealthVideo/ExerciseVideo/ExerciseVideo';
import MyPageEdit from './pages/MyPage/MyPage/MyPageEdit';

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
            <Route path="/" element={<Main />} />
            <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
            <Route path="/findgym" element={<ProtectedRoute><Map /></ProtectedRoute>} />
            <Route path="/exercise" element={<ProtectedRoute><Exercise /></ProtectedRoute>} />
            <Route path="/exercise/records/:month" element={<ProtectedRoute><ExerciseRecordPage /></ProtectedRoute>} />
            <Route path="/exercise/chart/:month" element={<ProtectedRoute><ExerciseChartPage /></ProtectedRoute>} />
            <Route path="/food" element={<Food />} />

            <Route path="/Board" element={<Outlet />}>
              <Route path="free" element={<FreeBoardPage />} />
              <Route path="free/post/:id" element={<ProtectedRoute><DetailPost /></ProtectedRoute>} />
              <Route path="free/post/edit/:id" element={<ProtectedRoute><UpdatePost /></ProtectedRoute>} />
              <Route path="free/createpost" element={<ProtectedRoute><CreatePost /></ProtectedRoute>} />
            </Route>

            <Route path="/exvideo" element={<ProtectedRoute><ExerciseVideo /></ProtectedRoute> } />
            <Route path="/edit" element={<ProtectedRoute><MyPageEdit
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