import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import FaIcon from '@/common/components/FaIcon';
import ConfirmationModal from '@/common/components/ModalChildrens/ConfirmationModal';
import useLoginContext from '@/common/libraries/auth';
import useModal from '@/common/hooks/useModal';
import cn from '@/common/utils/classNames';

interface NavItem {
  name: string;
  path: string;
  icon?: string;
}

const navItems: NavItem[] = [
  {
    name: 'Inicio',
    path: '/',
    icon: 'fa-solid fa-list',
  },
];

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
    <nav
      className={cn(
        'flex flex-col h-screen p-4 gap-4 bg-n0 flex-shrink-0 border-r border-n1'
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
