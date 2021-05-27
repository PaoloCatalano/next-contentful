import { createClient } from "contentful";
import Img from "next/image";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import Skeleton from "../../components/Skeleton";
const client = createClient({
  space: "5nv6yj8qblqw",
  accessToken: process.env.API_KEY,
});

export async function getStaticPaths() {
  const res = await client.getEntries({ content_type: "ricetta" });

  const paths = res.items.map((item) => {
    return { params: { slug: item.fields.slug } };
  });

  return {
    paths, // [{},{},{}]
    // fallback: false, rimanda a un 404 page se non esiste
    fallback: true, //re-run the getStaticProps and try to fetch new possible contents
  };
}

export const getStaticProps = async ({ params }) => {
  const res /* {items} */ = await client.getEntries({
    content_type: "ricetta",
    "fields.slug": params.slug,
  });

  if (!res.items.length) {
    return {
      redirect: {
        destination: "/",
        permanent: false, //a un determinato URL che viene digitato, si puo stabilire se assegnare un redirect permanente o no
      },
    };
  }

  return {
    props: {
      recipe: res.items[0], //recipe: items[0]
    },
    revalidate: 1,
  };
};

export default function RecipeDetails({ recipe }) {
  if (!recipe) return <Skeleton />;
  const { featureImage, title, cookingTime, method, ingredients } =
    recipe.fields;

  console.log(recipe.fields);

  // return "fix the bug first!";
  return (
    <div>
      <div className="banner">
        <Img
          src={"https:" + featureImage.fields.file.url}
          width={featureImage.fields.file.details.image.width}
          height={featureImage.fields.file.details.image.height}
        />
        <h2>{title}</h2>
      </div>

      <div className="info">
        <p>Takes about {cookingTime} mins to cook.</p>
        <h3>Ingredients:</h3>

        {ingredients.map((ing) => (
          <span key={ing}>{ing}</span>
        ))}
      </div>

      <div className="method">
        <h3>Method:</h3>
        <div>{documentToReactComponents(method)}</div>
      </div>

      <style jsx>{`
        h2,
        h3 {
          text-transform: uppercase;
        }
        .banner h2 {
          margin: 0;
          background: #fff;
          display: inline-block;
          padding: 20px;
          position: relative;
          top: -60px;
          left: -10px;
          transform: rotateZ(-1deg);
          box-shadow: 1px 3px 5px rgba(0, 0, 0, 0.1);
        }
        .info p {
          margin: 0;
        }
        .info span::after {
          content: " 🍡 ";
        }
        .info span:last-child::after {
          content: ".";
        }
      `}</style>
    </div>
  );
}
