import Header from '@/components/Header'
import MessageList from '@/components/MessageList'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800 dark:text-white">
          Welcome to Jacameno Messaging App
        </h1>
        <MessageList />
      </main>
    </div>
  )
}