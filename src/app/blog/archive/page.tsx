import { Suspense } from 'react';
import { PostCard } from '@/components/blog/PostCard';
import { getAllPosts, Post } from '@/lib/blog/posts';
import { ArchiveClient } from '@/components/blog/ArchiveClient';

export default function ArchivePage() {
  const allPosts = getAllPosts();
  
  return (
    <ArchiveClient posts={allPosts} />
  );
}
