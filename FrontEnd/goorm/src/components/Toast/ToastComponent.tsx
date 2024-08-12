import { Toast, ToastBody, ToastContainer, ToastHeader } from 'react-bootstrap';
import { ToastStore } from '../../store/store';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Toast.scss';

const ToastComponent = () => {
  const { toasts, hideToast } = ToastStore();

  return (
    <ToastContainer className='toastContainaer'>
      {Object.entries(toasts).map(([id, toast]) =>
        toast.isVisible && (
          <Toast key={id} onClose={() => hideToast(id)} delay={3000} autohide>
            <ToastHeader>
              <img src="holder.js/20x20?text=%20" className="rounded me-2" alt="" />
              <strong className="me-auto">알림</strong>
            </ToastHeader>
            <ToastBody>{toast.message}</ToastBody>
          </Toast>
        )
      )}
    </ToastContainer>
  );
};

export default ToastComponent;