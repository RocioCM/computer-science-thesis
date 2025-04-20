import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import FaIcon from '@/common/components/FaIcon';
import ConfirmationModal from '@/common/components/ModalChildrens/ConfirmationModal';
import useLoginContext from '@/common/libraries/auth';
import useModal from '@/common/hooks/useModal';
import cn from '@/common/utils/classNames';
import { ROLES } from '@/common/constants/auth';

interface NavItem {
  name: string;
  path: string;
  icon?: string;
}

const NAV_ITEMS_BY_ROLE: Record<string, NavItem[]> = {
  [ROLES.admin]: [
    {
      name: 'Inicio',
      path: '/',
      icon: 'fa-solid fa-list',
    },
    {
      name: 'Seguimiento',
      path: '/tracking',
      icon: 'fa-solid fa-arrows-spin',
    },
  ],
  [ROLES.producer]: [
    {
      name: 'Inicio',
      path: '/',
      icon: 'fa-solid fa-list',
    },
    {
      name: 'Material Reciclado',
      path: '/producer/recycled-batches',
      icon: 'fa-solid fa-recycle',
    },
    {
      name: 'Seguimiento',
      path: '/tracking',
      icon: 'fa-solid fa-arrows-spin',
    },
  ],
  [ROLES.secondary_producer]: [
    {
      name: 'Inicio',
      path: '/',
      icon: 'fa-solid fa-list',
    },
    {
      name: 'Seguimiento',
      path: '/tracking',
      icon: 'fa-solid fa-arrows-spin',
    },
  ],
  [ROLES.consumer]: [
    {
      name: 'Inicio',
      path: '/',
      icon: 'fa-solid fa-list',
    },
    {
      name: 'Seguimiento',
      path: '/tracking',
      icon: 'fa-solid fa-arrows-spin',
    },
  ],
  [ROLES.recycler]: [
    {
      name: 'Inventario',
      path: '/',
      icon: 'fa-solid fa-list',
    },
    {
      name: 'Envases',
      path: '/recycler/waste-bottles',
      icon: 'fa-solid fa-bottle-water',
    },
    {
      name: 'Seguimiento',
      path: '/tracking',
      icon: 'fa-solid fa-arrows-spin',
    },
  ],
  default: [
    {
      name: 'Inicio',
      path: '/',
      icon: 'fa-solid fa-list',
    },
    {
      name: 'Seguimiento',
      path: '/tracking',
      icon: 'fa-solid fa-arrows-spin',
    },
  ],
};

interface SideBarProps {}

const Item = ({
  icon,
  text,
  isExpanded,
}: {
  icon?: string;
  text: string;
  isExpanded: boolean;
}) => (
  <div
    className={cn(
      'h-max flex items-center font-medium cursor-pointer hover:text-p1 duration-1000 w-max'
    )}
  >
    {icon && <FaIcon type={icon} className="text-base w-4 h-4" />}
    <p
      className={cn(
        'font-medium h-6 leading-6 flex transition-[width,padding] overflow-hidden duration-500',
        isExpanded ? 'w-[8rem] pl-3' : 'w-0 pl-0'
      )}
    >
      {text}
    </p>
  </div>
);

const SideBar: React.FC<SideBarProps> = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { isLoggedIn, user, logout } = useLoginContext();
  const router = useRouter();

  const { Modal: LogoutModal, showModal: showLogoutModal } = useModal(
    false,
    ConfirmationModal
  );

  const handleHomeRedirect = () => {
    router.push('/');
  };

  const navItems = user?.role
    ? NAV_ITEMS_BY_ROLE[user.role] ?? NAV_ITEMS_BY_ROLE.default
    : NAV_ITEMS_BY_ROLE.default;

  if (!isLoggedIn || router.asPath.startsWith('/auth')) return null;

  return (
    <nav
      data-testid="sidebar"
      className={cn(
        'flex flex-col h-screen p-4 gap-4 bg-n0 flex-shrink-0 border-r border-n1 shadow-lg'
      )}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div onClick={handleHomeRedirect} className="cursor-pointer">
        <Item icon="fa-solid fa-meteor" text="Tesis" isExpanded={isExpanded} />
      </div>
      <ul className="flex-1 flex flex-col gap-4">
        {navItems.map((item) => (
          <li key={item.name}>
            <Link href={item.path}>
              <Item icon={item.icon} text={item.name} isExpanded={isExpanded} />
            </Link>
          </li>
        ))}
      </ul>

      <Link href="/profile">
        <Item icon="fa-regular fa-user" text="Perfil" isExpanded={isExpanded} />
      </Link>
      <div
        onClick={() => showLogoutModal()}
        className="w-full h-max flex flex-col justify-center items-center shrink-0"
      >
        <Item
          icon="fa-solid fa-sign-out-alt"
          text="Cerrar sesión"
          isExpanded={isExpanded}
        />
      </div>
      <LogoutModal
        title="¿Confirmas que deseas cerrar sesión?"
        subtitle="Si cierras sesión, deberás volver a iniciar sesión para acceder a tu cuenta."
        handleConfirm={() => logout(true)}
      />
    </nav>
  );
};

export default SideBar;
