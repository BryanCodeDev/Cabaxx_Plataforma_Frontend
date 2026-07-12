import { Link } from 'react-router-dom';
import Card from '@/components/common/Card';
import { formatDate, truncate } from '@/utils/format';
import { ROUTES } from '@/constants';

export default function PostCard({ post }) {
  return (
    <Card className="overflow-hidden">
      {post.coverUrl && (
        <img src={post.coverUrl} alt={post.title} className="aspect-video w-full object-cover" />
      )}
      <div className="p-4">
        <Badge color="primary">{post.type}</Badge>
        <Link to={`${ROUTES.BLOG}/${post.slug}`}>
          <h3 className="mt-2 font-semibold hover:text-brand-primary">{post.title}</h3>
        </Link>
        <p className="mt-1 text-sm text-slate-500">{truncate(post.excerpt, 100)}</p>
        <p className="mt-2 text-xs text-slate-400">{formatDate(post.publishedAt)}</p>
      </div>
    </Card>
  );
}
