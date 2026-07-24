import { StoreFront } from '@/components/StoreFront';
import { PRODUCTS, serviceLabels, ProductType, ServiceType, getSeoMetadataForService } from '@/lib/products';
import { Metadata } from 'next';

type Props = {
  params: Promise<{
    network: ProductType;
    service: ServiceType;
  }>;
}

export function generateStaticParams() {
  const paths: { network: string, service: string }[] = [];
  const uniquePairs = new Set<string>();

  for (const product of PRODUCTS) {
    const key = `${product.type}-${product.service_type}`;
    if (!uniquePairs.has(key)) {
      uniquePairs.add(key);
      paths.push({
        network: product.type,
        service: product.service_type,
      });
    }
  }

  return paths;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  
  const capitalize = (s: string) => {
    if (!s) return '';
    return s.charAt(0).toUpperCase() + s.slice(1);
  };
  
  const networkName = capitalize(resolvedParams.network);
  const { titleServiceName, descriptionServiceName } = getSeoMetadataForService(resolvedParams.service);

  const title = `Comprar ${titleServiceName} para ${networkName} en Perú | SocialBoost`;
  const description = `Mejora tu presencia en ${networkName} con nuestro servicio de ${descriptionServiceName}. Pago seguro con Yape y entrega inmediata. Resultados garantizados en Perú.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
    alternates: {
      canonical: `https://www.socialboostperu.store/${resolvedParams.network}/${resolvedParams.service}`
    }
  };
}

export default async function DynamicServicePage({ params }: Props) {
  const resolvedParams = await params;
  return <StoreFront initialCategory={resolvedParams.network} initialService={resolvedParams.service} />;
}
