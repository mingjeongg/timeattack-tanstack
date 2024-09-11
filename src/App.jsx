import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import axios from "axios";
import React, { useState } from "react";

const App = () => {
  const [newTitle, setNewTitle] = useState("");
  const [newViews, setNewViews] = useState("");
  const queryClient = useQueryClient();

  const {
    data: posts,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const response = await axios.get("http://localhost:4000/posts");
      return response.data;
    },
  });

  const mutation = useMutation({
    mutationFn: (newPost) => {
      axios.post("http://localhost:4000/posts", newPost);
    },
    onSuccess: () => {
      alert("데이터 추가가 성공했습니다");
      queryClient.invalidateQueries(["posts"]);
    },
  });

  if (isPending) {
    return <div>로딩중입니다..</div>;
  }
  if (isError) {
    return <div>오류가 발생하였습니다..</div>;
  }

  const handleChange = (e) => {
    e.preventDefault();
    const newPost = {
      title: newTitle,
      views: newViews,
    };
    mutation.mutate(newPost);
  };

  return (
    <div>
      <form onSubmit={handleChange}>
        <input
          type="text"
          value={newTitle}
          placeholder="new Title"
          onChange={(e) => {
            setNewTitle(e.target.value);
          }}
        />
        <input
          type="text"
          value={newViews}
          placeholder="new Views"
          onChange={(e) => {
            setNewViews(e.target.value);
          }}
        />
        <button>추가</button>
      </form>
      {posts.map((post) => {
        return (
          <div key={post.id}>
            <p>{post.title}</p>
            <p>{post.views}</p>
          </div>
        );
      })}
    </div>
  );
};

export default App;
