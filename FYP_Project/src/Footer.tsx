const Footer = () => {
  return (
    <footer className="border-t bg-background py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} All rights reserved.
        </div>
    </footer>
  );
};

export default Footer;