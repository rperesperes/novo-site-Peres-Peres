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
    <div className="py-24 bg-background min-h-screen">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-14 text-center animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-black">
            Artigos e Informes Tributários
          </h1>
          <p className="text-lg md:text-xl text-neutral-600 max-w-2xl mx-auto leading-relaxed">
            Análises normativas, acompanhamento jurisprudencial e posicionamentos técnicos
            elaborados pela PERES PERES Consultoria e Contabilidade.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => {
            const dateStr = post.created
              ? format(new Date(post.created), 'dd MMM yyyy', { locale: ptBR })
              : ''
            const imageUrl = post.cover ? pb.files.getUrl(post, post.cover) : null

            return (
              <Card
                key={post.id}
                className="flex flex-col h-full hover:shadow-md transition-shadow border-neutral-200 bg-white"
              >
                <div className="aspect-video w-full overflow-hidden bg-neutral-100 flex items-center justify-center border-b border-neutral-200">
                  {imageUrl ? (
                    <img src={imageUrl} alt={post.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-neutral-100 text-neutral-400">
                      <span className="text-xs font-mono uppercase tracking-wider text-neutral-400">
                        Publicação Técnica
                      </span>
                    </div>
                  )}
                </div>
                <CardHeader className="flex-grow">
                  <div className="flex items-center justify-between mb-2">
                    <Badge
                      variant="outline"
                      className="border-neutral-300 text-neutral-800 bg-neutral-50 font-mono text-[11px]"
                    >
                      {post.category || 'Tributário'}
                    </Badge>
                    {dateStr && (
                      <span className="flex items-center text-xs text-neutral-500">
                        <Calendar className="h-3 w-3 mr-1" />
                        {dateStr}
                      </span>
                    )}
                  </div>
                  <CardTitle className="text-lg font-serif line-clamp-2 text-black leading-snug">
                    {post.title}
                  </CardTitle>
                  <p className="text-neutral-600 mt-3 line-clamp-3 text-xs md:text-sm leading-relaxed">
                    {post.excerpt}
                  </p>
                </CardHeader>
                <CardFooter className="pt-0">
                  <Link
                    to={`/blog/${post.id}`}
                    className="text-xs font-semibold text-black flex items-center group underline decoration-[#FAB319] decoration-2 underline-offset-4"
                  >
                    Ler artigo completo{' '}
                    <ArrowRight className="h-3.5 w-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
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
