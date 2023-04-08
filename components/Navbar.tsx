import NavbarItem from "@/components/NavbarItem";

const Navbar = () => {
  return (
    <nav className="fixed z-40 w-full">
      <div
        className="px-4 md:px-16 py-6 flex flex-row items-center transition duration-500 $
        bg-zinc-900 bg-opacity-90
        "
      >
        <img src="/images/logo.png" className="h-4 lg:h-7" alt="Logo" />
        <div className="flex-row hidden ml-8 gap-7 lg:flex">
          <NavbarItem label="Home" active />
          <NavbarItem label="Series" />
          <NavbarItem label="Films" />
          <NavbarItem label="New & Popular" />
          <NavbarItem label="My List" />
          <NavbarItem label="Browse by Languages" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
