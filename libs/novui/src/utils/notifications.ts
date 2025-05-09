import { showNotification } from '@mantine/notifications';

export function errorMessage(message: string) {
  showNotification({
    message,
    color: 'red',
  });
}

export function successMessage(message: string, id?: string) {
  showNotification({
    id,
    message,
    color: 'green',
  });
}
