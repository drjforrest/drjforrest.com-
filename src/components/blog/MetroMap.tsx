"use client";

import { TubeMapSvg } from './TubeMapSvg';

interface MetroMapProps {
  categories: string[];
  tags: string[];
}

export function MetroMap({ categories, tags }: MetroMapProps) {
  return <TubeMapSvg categories={categories} tags={tags} />;
}
