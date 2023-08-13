import Link from "next/link";
import clsx from "clsx";

import { BsTwitter, BsGithub } from "react-icons/bs";
import { FaLinkedinIn } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

function NavLink({ href, children }) {
  return (
    <Link
      href={href}
      className="font-poppins transition md:hover:text-orange-500 md:dark:hover:text-lime-400"
    >
      {children}
    </Link>
  );
}

function SocialLinkMobile({ className, icon: Icon, ...props }) {
  return (
    <Link className="group -m-1 p-1" {...props}>
      <Icon
        className={clsx(
          className,
          "h-5 w-5 fill-zinc-500 transition dark:fill-zinc-400"
        )}
      />
    </Link>
  );
}

export function Footer() {
  return (
    <footer id="footer" className="mt-24 z-30 max-w-5xl mx-auto">
      {/* <Container.Outer> */}
      <div className="border-t border-zinc-100 bg-white py-8 md:py-10 px-4 dark:border-zinc-700/40 dark:bg-black">
        {/* <Container.Inner> */}
        <div className="flex flex-col items-center justify-between gap-8 lg:flex-row">
          <div className="hidden gap-6 text-sm font-medium text-zinc-800 dark:text-zinc-200 lg:flex">
            <NavLink href="https://twitter.com/_rittik">Twitter</NavLink>
            <NavLink href="https://github.com/rittikbasu">GitHub</NavLink>
            <NavLink href="https://www.linkedin.com/in/rittikbasu/">
              LinkedIn
            </NavLink>
            <NavLink href="mailto:contact@rittik.io">Mail</NavLink>
          </div>
          <div className="flex gap-x-12 lg:hidden">
            <SocialLinkMobile
              href="https://twitter.com"
              aria-label="Follow on Twitter"
              icon={BsTwitter}
            />
            <SocialLinkMobile
              href="https://github.com"
              aria-label="Follow on GitHub"
              icon={BsGithub}
            />
            <SocialLinkMobile
              href="https://linkedin.com"
              aria-label="Follow on LinkedIn"
              icon={FaLinkedinIn}
            />
            <SocialLinkMobile
              className="h-6 w-6"
              href="mailto:contact@rittik.io"
              icon={MdEmail}
            />
          </div>
          <p className="text-sm text-zinc-400 tracking-widest font-mono dark:text-zinc-500">
            Made with ♥️ by Rittik Basu
          </p>
        </div>
        {/* </Container.Inner> */}
      </div>
      {/* </Container.Outer> */}
    </footer>
  );
}
