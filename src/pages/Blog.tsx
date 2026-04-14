import { useState, useEffect } from 'react'
import { getPosts } from '@/services/posts'
import { useRealtime } from '@/hooks/use-realtime'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import pb from '@/lib/pocketbase/client'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Calendar } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Blog() {
  const [posts, setPosts] = useState<any[]>([])

  const loadData = async () => {
    try {
      const data = await getPosts()
      setPosts(data.filter((p) => p.status === 'published'))
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    loadData()
  }, [])
  useRealtime('posts', () => {
    loadData()
  })

  return (
    <div className="py-24 bg-background">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4 text-black">Blog Tributário</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Artigos, análises de jurisprudência e conteúdos técnicos produzidos pela nossa equipe
            para manter você atualizado.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, i) => {
            const dateStr = post.created
              ? format(new Date(post.created), 'dd MMM yyyy', { locale: ptBR })
              : ''
            const imageUrl = post.cover
              ? pb.files.getUrl(post, post.cover)
              : `https://img.usecurling.com/p/600/400?q=tax%20law&seed=${i}`

            return (
              <Card
                key={post.id}
                className="flex flex-col h-full hover:shadow-lg transition-shadow border-gray-200"
              >
                <div className="aspect-video w-full overflow-hidden bg-muted">
                  <img
                    src={imageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <CardHeader className="flex-grow">
                  <div className="flex items-center justify-between mb-2">
                    <Badge
                      variant="secondary"
                      className="bg-primary text-black hover:bg-primary/90 font-bold"
                    >
                      {post.category || 'Geral'}
                    </Badge>
                    <span className="flex items-center text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3 mr-1" />
                      {dateStr}
                    </span>
                  </div>
                  <CardTitle className="text-xl line-clamp-2 hover:text-gray-700 underline-offset-4 hover:underline text-black cursor-pointer transition-all">
                    {post.title}
                  </CardTitle>
                  <p className="text-muted-foreground mt-3 line-clamp-3 text-sm">{post.excerpt}</p>
                </CardHeader>
                <CardFooter className="pt-0">
                  <Link
                    to={`/blog/${post.id}`}
                    className="text-sm font-bold text-black flex items-center group bg-primary px-3 py-1.5 rounded-md hover:bg-primary/80 transition-colors w-fit"
                  >
                    Ler artigo completo{' '}
                    <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
