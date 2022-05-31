import React, { useEffect, useState } from "react"
import { graphql, useStaticQuery } from "gatsby"

// styles
const pageStyles = {
  color: "#232129",
  fontFamily: "-apple-system, Roboto, sans-serif, serif",
  height: "100vh",
  padding: "50px 200px"
}
const headingStyles = {
  marginTop: 0,
  marginBottom: 64
}

const listStyles = {
  marginBottom: 96,
  paddingLeft: 0,
  maxWidth: 950
}
const listItemStyles = {
  fontWeight: 300,
  fontSize: 24,
  marginBottom: 30,
}

const linkStyle = {
  color: "#8954A8",
  fontWeight: "bold",
  fontSize: 16,
  verticalAlign: "5%",
}

const docLinkStyle = {
  ...linkStyle,
  listStyleType: "none",
  marginBottom: 24,
}

const descriptionStyle = {
  color: "#232129",
  fontSize: 14,
  marginTop: 10,
  marginBottom: 0,
  lineHeight: 1.25,
}


// markup
const IndexPage = () => {

  const [ dynamicData, setDynamicData ]  = useState([])

  // Build Time Data Fetching
  const gatsbyRepoData = useStaticQuery(graphql`
    query {
      allContentfulBlogPost {
        edges {
          node {
            title
            subtitle
            author
            slug
            image {
              url
            }
            content {
              raw
            }
          }
        }
      }
    }
  `)

  const { allContentfulBlogPost: { edges } } = gatsbyRepoData


  useEffect(() => {
    fetchDynamicData()
  },[])

  const fetchDynamicData = async () => {
    // Build the GraphQL Query
    const query = `{
        blogPostCollection {
          total
          items {
            id
            title
            subtitle
            slug
            image {
              url
            }
            content {
              json
            }
          }
        }
      }`;

    // Send a POST request via fetch to the Contentful GraphQL URL endpoint
    let response = await fetch(`https://graphql.contentful.com/content/v1/spaces/ofnzz0psu4uq`, {
      method: "POST",
      // Include Authorization and Content-Type HTTP headers
      headers: {
        Authorization: `Bearer digIxyanwWcFv_zGEAFJCLffYHSMmgtNhsBgTCKSIaQ`,
        "Content-Type": "application/json",
      },
      // Send the GraphQL query in the body of the request
      body: JSON.stringify({ query }),
    })

    response = await response.json()
    setDynamicData(response.data)
  }

  return (
    <main style={pageStyles}>
      <title>Home Page</title>
      <h1 style={headingStyles}>
        Static and Dynamic Demonstration of a Gatsby/Contentful Site
      </h1>
      <ul style={listStyles}>
        <li style={docLinkStyle}>
          Static Conent
        </li>
        {edges.map(link => (
          <li key={link.node.slug} style={{ ...listItemStyles }}>
            <span>
              {link.node.title}
              <p style={descriptionStyle}>{link.node.subtitle}</p>
            </span>
          </li>
        ))}

        <li style={docLinkStyle}>
          Dynamic Content
        </li>
        {dynamicData?.blogPostCollection?.items.map(link => (
            <li key={link.slug} style={{ ...listItemStyles }}>
            <span>
              {link.title}
              <p style={descriptionStyle}>{link.subtitle}</p>
            </span>
          </li>
        ))}

      </ul>
      <img
        alt="Gatsby G Logo"
        src="data:image/svg+xml,%3Csvg width='24' height='24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12 2a10 10 0 110 20 10 10 0 010-20zm0 2c-3.73 0-6.86 2.55-7.75 6L14 19.75c3.45-.89 6-4.02 6-7.75h-5.25v1.5h3.45a6.37 6.37 0 01-3.89 4.44L6.06 9.69C7 7.31 9.3 5.63 12 5.63c2.13 0 4 1.04 5.18 2.65l1.23-1.06A7.959 7.959 0 0012 4zm-8 8a8 8 0 008 8c.04 0 .09 0-8-8z' fill='%23639'/%3E%3C/svg%3E"
      />
    </main>
  )
}

export default IndexPage
