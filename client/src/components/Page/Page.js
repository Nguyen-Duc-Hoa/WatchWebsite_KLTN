import React from "react";
import { Helmet } from "react-helmet";

const canonicalRootURL = process.env.REACT_APP_CLIENT_DOMAIN;
const siteTitle = "Discover Better Watch";
const addressCountry = "VN";
const addressRegion = "Ho Chi Minh";
const postalCode = "71310";
const streetAddress = "1 Võ Văn Ngân";

const defaultImageUrl = `https://htluxury.vn/wp-content/uploads/2020/02/blancpain.jpg`;

const Page = ({
  children,
  title,
  description,
  canonicalPath,
  schema,
  imageUrl,
}) => {
  const canonicalUrl = `${canonicalRootURL}${canonicalPath}`;
  const schemaFromProps = Array.isArray(schema) ? schema : [schema];
  const schemaArrayJSONString = JSON.stringify([
    ...schemaFromProps,
    {
      "@context": "http://schema.org",
      "@type": "Organization",
      "@id": `${canonicalRootURL}#organization`,
      url: canonicalRootURL,
      name: siteTitle,
      address: {
        addressCountry,
        addressRegion,
        postalCode,
        streetAddress,
      },
    },
    {
      "@context": "http://schema.org",
      "@type": "WebSite",
      url: canonicalRootURL,
      description: description,
      name: title,
      publisher: {
        "@id": `${canonicalRootURL}#organization`,
      },
    },
  ]);

  return (
    <div>
      <Helmet>
        <title>{title}</title>
        <link rel="canonical" href={canonicalUrl} />
        <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />

        <meta name="description" key="description" content={description} />
        <meta name="title" key="title" content={title} />
        <meta property="og:title" key="og:title" content={title} />
        <meta property="og:locale" key="og:locale" content="en_US" />
        <meta property="og:type" key="og:type" content="website" />
        <meta
          property="og:description"
          key="og:description"
          content={description}
        />

        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@publisher_handle" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />

        <meta property="og:image:width" content="150" />
        <meta property="og:image:height" content="150" />

        <meta
          property="og:image:secure_url"
          key="og:image"
          content={imageUrl || defaultImageUrl}
        />

        <meta
          property="og:image"
          key="og:image"
          content={imageUrl || defaultImageUrl}
        />

        <script type="application/ld+json">{schemaArrayJSONString}</script>
      </Helmet>
      {children}
    </div>
  );
};

export default Page;
