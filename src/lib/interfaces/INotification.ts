import {ENotificationType} from '@/lib/enums';
import {IUser} from './IUser';

export interface INotification {
  title: string;
  content: string;
  read: boolean;
  to?: string | IUser;
  type: ENotificationType;
  redirectUrl?: string;
}
