import { GetServerSideProps } from "next";
import Image from "next/future/image";
import Link from "next/link";
import { stripe } from "../lib/stripe"; 
import Stripe from "stripe";
import { ImageContainer, SucessContainer } from "../styles/pages/success";

interface SucessProps {
  costumerName: string;
  product: {
    name: string;
    imageUrl: string;
  }
}
export default function Sucess({costumerName, product}: SucessProps) {
  return(
    <SucessContainer>
      <h1>Compra efetuada</h1>

      <ImageContainer>
        <Image src={product.imageUrl} width={120} height={110} alt="" />
      </ImageContainer>

      <p>
      Uhuul <strong>{costumerName}</strong>, sua <strong>{product.name}</strong> já está a caminho da sua casa.
      </p>

      <Link href="/">
        Voltar ao catálogo
      </Link>
    </SucessContainer>
  )
}

export const getServerSideProps: GetServerSideProps = async ({query}) => {
  if (!query.session_id){
    return {
      redirect: {
        destination: '/',
        permanent: false,
      }
    }
  }
  const sessionId = String(query.session_id);

  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ['line_items', 'line_items.data.price.product']
  });

  const costumerName = session.customer_details.name;
  const product = session.line_items.data[0].price.product as Stripe.Product;

  return {
    props: {
      costumerName,
      product: {
        name: product.name,
        imageUrl: product.images[0]
      }
    }
  }
}