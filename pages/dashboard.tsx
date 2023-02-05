import Button from '@/components/Button'
import Card from '@/components/Card'
import Header from '@/components/Header'
import Layout from '@/components/Layout'
import Text from '@/components/Text'

export default function Home() {
  return (
    <div>
      <Layout className="py-6">
        <Header />
        <Text
          type="p"
          className="mt-10 text-4xl font-semibold"
        >
          Good morning,
          <br /> Eduardo.
        </Text>
        <div className="flex mt-10 gap-x-3">
          <Button
            type="chip"
            active={true}
          >
            All Todos
          </Button>
          <Button
            type="chip"
            active={false}
          >
            Completed
          </Button>
        </div>
        <Card className="mt-10" />
        <Card className="mt-10" />
      </Layout>
    </div>
  )
}
