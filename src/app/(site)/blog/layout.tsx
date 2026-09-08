import "./blog-theme.css";

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="blog-theme">{children}</div>;
}
