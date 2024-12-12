interface FooterProps {
  className?: string;
}

export default function Footer({ className }: FooterProps) {
  return (
    <footer className={className}>
      <div className=" h-auto w-full py-5 text-center bg-gray-50">
            <p className="text-gray-500">
            A project by{" "}
            <a
              className="font-semibold text-gray-600 underline-offset-4 transition-colors hover:text-sky-400"
              href="https://github.com/jek030"
              target="_blank"
              rel="noopener noreferrer"
            >
              jek030
            </a>
            </p>
      </div>
    </footer>
  );
}