import { MiniInstagramPreview } from './InstagramPostPreview'
import type { BusinessProfile, SavedPost } from '../types'

export function SavedPosts({ business, posts }: { business: BusinessProfile; posts: SavedPost[] }) {
  return (
    <section className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">Saved posts</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight">Approved ideas for later</h2>
        </div>
        <span className="rounded-full bg-stone-100 px-3 py-1 text-sm font-semibold text-zinc-600">{posts.length} saved</span>
      </div>

      {posts.length === 0 ? (
        <div className="mt-6 rounded-lg border border-dashed border-zinc-300 bg-[#f7f4ee] p-6 text-sm leading-6 text-zinc-600">
          Select a content idea and save the generated post package. Saved posts stay in React state for this session.
        </div>
      ) : (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {posts.map((post) => (
            <SavedPostCard business={business} post={post} key={post.id} />
          ))}
        </div>
      )}
    </section>
  )
}

function SavedPostCard({ business, post }: { business: BusinessProfile; post: SavedPost }) {
  return (
    <article className="grid gap-4 rounded-lg border border-zinc-200 bg-[#f7f4ee] p-4 sm:grid-cols-[7rem_1fr]">
      <MiniInstagramPreview business={business} idea={post.idea} />
      <div>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-emerald-700">{post.idea.day}</p>
            <h3 className="mt-1 font-semibold tracking-tight">{post.idea.title}</h3>
          </div>
          <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-zinc-600 ring-1 ring-zinc-200">{post.idea.postType}</span>
        </div>
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-zinc-600">{post.captionPackage.caption}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {post.captionPackage.hashtags.slice(0, 4).map((tag) => (
            <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-zinc-600 ring-1 ring-zinc-200" key={tag}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  )
}
