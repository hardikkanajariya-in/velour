"use client";

import { useState, useEffect, useCallback } from "react";
import { DataTable } from "@/components/admin/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Plus, Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: string;
  tags: string[];
  category: string;
  isPublished: boolean;
  publishedAt: string | null;
  createdAt: string;
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);

  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [author, setAuthor] = useState("");
  const [tags, setTags] = useState("");
  const [category, setCategory] = useState("Fashion");
  const [isPublished, setIsPublished] = useState(false);

  const fetchPosts = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/blog");
      const data = await res.json();
      setPosts(data);
    } catch {
      toast.error("Failed to fetch posts");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const resetForm = () => {
    setTitle("");
    setExcerpt("");
    setContent("");
    setCoverImage("");
    setAuthor("");
    setTags("");
    setCategory("Fashion");
    setIsPublished(false);
    setEditingPost(null);
  };

  const openCreate = () => {
    resetForm();
    setShowModal(true);
  };

  const openEdit = (post: BlogPost) => {
    setEditingPost(post);
    setTitle(post.title);
    setExcerpt(post.excerpt);
    setContent(post.content);
    setCoverImage(post.coverImage);
    setAuthor(post.author);
    setTags(post.tags.join(", "));
    setCategory(post.category);
    setIsPublished(post.isPublished);
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!title.trim() || !excerpt.trim() || !content.trim()) {
      toast.error("Title, excerpt, and content are required");
      return;
    }

    const payload = {
      title,
      excerpt,
      content,
      coverImage,
      author: author || "Admin",
      tags: tags
        .split(",")
        .map((t: string) => t.trim())
        .filter(Boolean),
      category,
      isPublished,
    };

    try {
      const method = editingPost ? "PATCH" : "POST";
      const body = editingPost ? { id: editingPost.id, ...payload } : payload;
      const res = await fetch("/api/admin/blog", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error();
      toast.success(editingPost ? "Post updated" : "Post created");
      setShowModal(false);
      resetForm();
      fetchPosts();
    } catch {
      toast.error("Failed to save post");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this post?")) return;
    try {
      const res = await fetch("/api/admin/blog", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error();
      toast.success("Post deleted");
      fetchPosts();
    } catch {
      toast.error("Failed to delete");
    }
  };

  const togglePublish = async (post: BlogPost) => {
    try {
      const res = await fetch("/api/admin/blog", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: post.id, isPublished: !post.isPublished }),
      });
      if (!res.ok) throw new Error();
      toast.success(post.isPublished ? "Post unpublished" : "Post published");
      fetchPosts();
    } catch {
      toast.error("Failed to update");
    }
  };

  const columns = [
    {
      key: "title",
      label: "Title",
      render: (post: BlogPost) => (
        <div>
          <p className="font-medium">{post.title}</p>
          <p className="text-xs text-muted-foreground">{post.category}</p>
        </div>
      ),
    },
    { key: "author", label: "Author" },
    {
      key: "isPublished",
      label: "Status",
      render: (post: BlogPost) => (
        <button onClick={() => togglePublish(post)} className="cursor-pointer">
          <Badge variant={post.isPublished ? "success" : "warning"}>
            {post.isPublished ? "Published" : "Draft"}
          </Badge>
        </button>
      ),
    },
    {
      key: "createdAt",
      label: "Created",
      render: (post: BlogPost) => new Date(post.createdAt).toLocaleDateString(),
    },
    {
      key: "actions",
      label: "",
      render: (post: BlogPost) => (
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => openEdit(post)}
            className="p-1.5 hover:bg-muted rounded-md transition-colors"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(post.id)}
            className="p-1.5 hover:bg-red-50 text-red-500 rounded-md transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  if (loading)
    return <div className="animate-pulse h-64 bg-muted rounded-card" />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
        <h1 className="text-xl sm:text-2xl font-heading font-bold">
          Blog Posts
        </h1>
        <Button variant="primary" onClick={openCreate}>
          <Plus className="w-4 h-4 mr-2" /> New Post
        </Button>
      </div>

      <DataTable columns={columns} data={posts} />

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingPost ? "Edit Post" : "New Post"}
      >
        <div className="space-y-4">
          <Input
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Input
            label="Excerpt"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
          />
          <div>
            <label className="block text-sm font-medium mb-1">Content</label>
            <textarea
              className="w-full border border-border rounded-card px-3 py-2 text-sm min-h-[160px] resize-y focus:outline-none focus:ring-2 focus:ring-accent"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
          <Input
            label="Cover Image URL"
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Admin"
            />
            <Select
              label="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              options={[
                { label: "Fashion", value: "Fashion" },
                { label: "Style Guide", value: "Style Guide" },
                { label: "Trends", value: "Trends" },
                { label: "Behind the Scenes", value: "Behind the Scenes" },
              ]}
            />
          </div>
          <Input
            label="Tags (comma-separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="fashion, summer, trends"
          />
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="accent-accent"
            />
            Publish immediately
          </label>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              {editingPost ? "Update" : "Create"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
