import Button from '@/components/Button'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="mb-4 text-3xl font-semibold text-white">Todo App</h1>
      <div className="flex items-center gap-x-4">
        <Button
          href="/signup"
          type="default"
          className="px-8"
        >
          Signup
        </Button>
        <Button
          href="signin"
          type="default"
          className="px-8"
        >
          Login
        </Button>
      </div>
    </div>
  )
}
