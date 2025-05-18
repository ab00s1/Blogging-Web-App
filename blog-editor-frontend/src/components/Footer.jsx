export default function Footer() {
  return (
    <footer className="w-full border-t border-orange-100 bg-white/90 backdrop-blur-md text-center py-4">
      <div className="container mx-auto px-4">
        <p className="text-sm text-gray-500">
          © {new Date().getFullYear()}{' '}
          <span className="bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-transparent font-medium">
            Blogger
          </span>
          . All rights reserved.
        </p>
      </div>
    </footer>
  );
}
