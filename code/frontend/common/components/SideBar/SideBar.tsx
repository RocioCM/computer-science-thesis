import Link from 'next/link';
import { useRouter } from 'next/router';
import Img from '@/common/components/Img';
import ConfirmationModal from '@/common/components/ModalChildrens/ConfirmationModal';
import useLoginContext from '@/common/libraries/auth';
import useModal from '@/common/hooks/useModal';
import { ImageProps } from 'next/image';
import iconLogOut from '@/public/assets/icon-log-out.svg';
import iconUsers from '@/public/assets/icon-users.svg';
import iconBuilding from '@/public/assets/icon-building.svg';

interface NavItem {
  name: string;
  path: string;
  icon?: ImageProps['src'];
}

const navItems: NavItem[] = [
  {
    name: 'Inicio',
    path: '/',
    icon: iconBuilding,
  },

  {
    name: 'Perfil',
    path: '/profile',
    icon: iconUsers,
  },
];

interface SideBarProps {}

const SideBar: React.FC<SideBarProps> = () => {
  const { isLoggedIn, logout } = useLoginContext();
  const router = useRouter();

  const { Modal: LogoutModal, showModal: showLogoutModal } = useModal(
    false,
    ConfirmationModal
  );

  const handleHomeRedirect = () => {
    router.push('/');
  };

  if (!isLoggedIn || router.asPath.startsWith('/auth')) return null;

  return (
    <nav className="flex flex-col h-screen bg-p1-25 shadow-e2 w-[var(--sidebar-width)] flex-shrink-0 rounded-r-2xl">
      <div
        onClick={handleHomeRedirect}
        className="flex justify-between items-center p-4 cursor-pointer text-3xl font-bold"
      >
        Tesis
      </div>
      <ul className="flex-grow p-2">
        {navItems.map((item) => (
          <li key={item.name} className="mb-2">
            <Link href={item.path}>
              <div className="flex items-center px-4 py-3 font-medium cursor-pointer">
                {item.icon && (
                  <Img
                    src={item.icon}
                    width="50"
                    height="50"
                    alt="icon"
                    className="w-5 h-5 object-contain"
                  />
                )}
                <span className="ml-3 font-medium">{item.name}</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
      <div
        onClick={() => showLogoutModal()}
        className="w-full p-4 border-t border-p1 flex flex-row justify-center items-center gap-2 cursor-pointer"
      >
        <Img
          src={iconLogOut}
          alt="Cerrar sesión"
          className="flex-shrink-0 w-4 h-4 object-contain"
        />
        <p className="text-sm">Cerrar sesión</p>
      </div>
      <LogoutModal
        title="¿Confirmas que deseas cerrar sesión?"
        handleContinue={() => logout(true)}
      />
    </nav>
  );
};

export default SideBar;
