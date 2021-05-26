import { createClient } from "contentful";
import RecipeCard from "../components/RecipeCard";

export async function getStaticProps() {
  const client = createClient({
    space: "5nv6yj8qblqw",
    accessToken: process.env.API_KEY,
  });

  const res = await client.getEntries({ content_type: "ricetta" });

  return {
    props: {
      recipes: res.items,
    },
  };
}

export default function Recipes({ recipes }) {
  return (
    <div className="recipe-list">
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.sys.id} recipe={recipe} />
      ))}

      <style jsx>{`
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-gap: 20px 60px;
      `}</style>
    </div>
  );
}
