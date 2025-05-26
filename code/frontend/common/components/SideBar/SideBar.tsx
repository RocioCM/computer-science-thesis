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
  [ROLES.producer]: [
    {
      name: 'Lotes producidos',
      path: '/producer',
      icon: 'fa-solid fa-list',
    },
    {
      name: 'Material reciclado',
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
      name: 'Inventario',
      path: '/secondary-producer',
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
      name: 'Botellas recicladas',
      path: '/consumer',
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
      name: 'Lotes de material',
      path: '/recycler',
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
  isActive,
}: {
  icon?: string;
  text: string;
  isExpanded: boolean;
  isActive?: boolean;
}) => (
  <div
    className={cn(
      'h-max flex items-center font-medium cursor-pointer hover:text-p1 duration-1000 w-max',
      isActive ? 'text-p1' : ''
    )}
  >
    {icon && <FaIcon type={icon} className="text-base w-4 h-4" />}
    <p
      className={cn(
        'h-6 leading-6 flex transition-[width,padding] overflow-hidden duration-500',
        isExpanded ? 'w-[8rem] pl-3' : 'w-0 pl-0',
        isActive ? 'font-semibold' : 'font-normal'
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
  const path = router.asPath.split('?')[0];

  const { Modal: LogoutModal, showModal: showLogoutModal } = useModal(
    false,
    ConfirmationModal
  );

  const { Modal: SupportModal, showModal: showSupportModal } = useModal();

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
      <ul className="flex-1 flex flex-col gap-4">
        {navItems.map((item) => (
          <li key={item.name}>
            <Link href={item.path}>
              <Item
                icon={item.icon}
                text={item.name}
                isExpanded={isExpanded}
                isActive={path === item.path}
              />
            </Link>
          </li>
        ))}
      </ul>
      <Link href="/profile">
        <Item
          icon="fa-regular fa-user"
          text="Perfil"
          isExpanded={isExpanded}
          isActive={path === '/profile'}
        />
      </Link>
      <div onClick={showSupportModal}>
        <Item icon="fa-solid fa-headset" text="Ayuda" isExpanded={isExpanded} />
      </div>
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

      <SupportModal>
        <div className="flex flex-col items-center p-4 text-center">
          <FaIcon
            type="fa-solid fa-headset"
            className="text-4xl text-p1 mb-3"
          />
          <h2 className="text-2xl font-semibold mb-2">Ayuda</h2>
          <p className="mb-6 text-gray-600">
            Estamos disponibles para ayudarte con cualquier problema o duda
            sobre el sistema.
          </p>

          <div className="flex justify-center gap-4 w-full max-w-md">
            <a
              href="https://wa.me/+5492610000000"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-p1 text-n0 py-3 px-4 rounded-lg"
            >
              <FaIcon type="fa-brands fa-whatsapp" className="text-xl" />
              <span>WhatsApp</span>
            </a>

            <a
              href="mailto:support@tesis.com"
              className="w-full flex items-center justify-center gap-2 bg-p3 text-n0 py-3 px-4 rounded-lg"
            >
              <FaIcon type="fa-solid fa-envelope" className="text-lg" />
              <span>Email</span>
            </a>
          </div>
        </div>
      </SupportModal>

      <LogoutModal
        title="¿Deseas cerrar sesión?"
        subtitle="Si cierras sesión, deberás volver a iniciar sesión para acceder a tu cuenta."
        icon="fa-solid fa-right-from-bracket"
        handleConfirm={() => logout(true)}
      />
    </nav>
  );
};

export default SideBar;
