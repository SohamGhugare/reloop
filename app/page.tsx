import { WalletConnectButton } from './components/WalletConnectButton';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="w-full p-4 flex justify-end">
        <WalletConnectButton />
      </nav>
      <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
        <h1 className="text-4xl font-bold mb-4">
          Your Hackathon Journey starts here...
        </h1>
        <p className="text-lg italic">
          Start by editing <code className="bg-gray-100 px-2 py-1 rounded">app/page.tsx</code> or click{" "}
          <a href="#" className="text-blue-600 hover:underline">
            here
          </a>{" "}
          to read full documentation.
        </p>
      </div>
      <footer className="text-center p-4 text-gray-600">
        Made with ❤️ by <a href="https://hackdb.io" className="text-black">hackdb</a>
      </footer>
    </div>
  );
}
