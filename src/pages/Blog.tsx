import { BLOG_POSTS } from '@/lib/data'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Calendar } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Blog() {
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
          {BLOG_POSTS.map((post, i) => (
            <Card
              key={post.id}
              className="flex flex-col h-full hover:shadow-lg transition-shadow border-gray-200"
            >
              <div className="aspect-video w-full overflow-hidden bg-muted">
                <img
                  src={`https://img.usecurling.com/p/600/400?q=tax%20law&seed=${i}`}
                  alt={post.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <CardHeader className="flex-grow">
                <div className="flex items-center justify-between mb-2">
                  <Badge
                    variant="secondary"
                    className="bg-primary/10 text-primary hover:bg-primary/20"
                  >
                    {post.category}
                  </Badge>
                  <span className="flex items-center text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3 mr-1" />
                    {post.date}
                  </span>
                </div>
                <CardTitle className="text-xl line-clamp-2 hover:text-primary text-black cursor-pointer transition-colors">
                  {post.title}
                </CardTitle>
                <p className="text-muted-foreground mt-3 line-clamp-3 text-sm">{post.excerpt}</p>
              </CardHeader>
              <CardFooter className="pt-0">
                <Link
                  to={`/blog/${post.id}`}
                  className="text-sm font-semibold text-primary flex items-center group"
                >
                  Ler artigo completo{' '}
                  <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
