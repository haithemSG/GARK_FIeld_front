import { environment } from 'src/environments/environment';
const adminRoot = environment.adminRoot;
export interface IMenuItem {
  id?: string;
  icon?: string;
  label: string;
  to: string;
  newWindow?: boolean;
  subs?: IMenuItem[];
}

const data: IMenuItem[] = [
  {
    icon: 'flaticon-speedometer',
    label: 'Tableau de bord',
    to: `${adminRoot}/dashboards/analytics`,
  },
  {
    icon: 'flaticon-calendar',
    label: 'Réservations',
    to: `${adminRoot}/mes-terrains`,
  }, 
  {
    icon: 'flaticon-soccer-field',
    label: 'Mes Terrains',
    to: `${adminRoot}/terrains`,
    subs: []
  },
  {
    icon: 'flaticon-accounting',
    label: 'Comptabilité',
    to: `${adminRoot}/dashboards/financial`,
    subs: []
  },
  // {
  //   icon: 'simple-icon-settings',
  //   label: 'Compte',
  //   to: `${adminRoot}/compte`,
  // },
];
export default data;
