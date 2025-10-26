import { client } from '@/sanity/lib/client'
import imageUrlBuilder from '@sanity/image-url'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const builder = imageUrlBuilder(client)

function urlFor(source: any) {
  return builder.image(source)
}

async function getTeamMembers() {
  const members = await client.fetch(`
    *[_type == "teamMember"] | order(order asc) {
      _id,
      name,
      role,
      bio,
      photo,
      expertise
    }
  `)
  return members
}

export const metadata = {
  title: 'About Us | Kilalo',
  description: 'Learn about Kilalo and our mission to help businesses succeed.',
}

export default async function AboutPage() {
  const teamMembers = await getTeamMembers()

  return (
    <div className="container py-16 md:py-24">
      {/* Hero Section */}
      <div className="mx-auto max-w-3xl text-center mb-16">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
          About Kilalo
        </h1>
        <p className="text-lg text-muted-foreground">
          We're a team of passionate professionals dedicated to helping businesses
          achieve their full potential through strategic planning, innovative marketing,
          and transformative leadership development.
        </p>
      </div>

      {/* Mission & Vision */}
      <div className="grid gap-8 md:grid-cols-2 mb-20">
        <Card>
          <CardHeader>
            <CardTitle className="text-teal text-2xl">Our Mission</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              To empower businesses with the strategies, tools, and leadership they need
              to thrive in an ever-changing market. We believe in building lasting
              partnerships that drive sustainable growth and create meaningful impact.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-orange text-2xl">Our Vision</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              To be the trusted partner of choice for businesses seeking transformative
              growth. We envision a world where every organization has access to
              world-class strategic guidance and innovative solutions.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Team Section */}
      <div className="mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our diverse team brings together decades of experience across strategy,
            marketing, leadership, and technology.
          </p>
        </div>

        {teamMembers.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {teamMembers.map((member: any) => (
              <Card key={member._id}>
                {member.photo && (
                  <div className="aspect-square overflow-hidden">
                    <Image
                      src={urlFor(member.photo).width(400).height(400).url()}
                      alt={member.photo.alt || member.name}
                      width={400}
                      height={400}
                      className="object-cover w-full h-full"
                    />
                  </div>
                )}
                <CardHeader>
                  <CardTitle>{member.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{member.bio}</p>
                  {member.expertise && member.expertise.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {member.expertise.map((skill: string, index: number) => (
                        <span
                          key={index}
                          className="inline-flex items-center rounded-full bg-teal/10 px-2 py-1 text-xs font-medium text-teal"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Team profiles coming soon!
            </p>
          </div>
        )}
      </div>

      {/* Values */}
      <div className="rounded-lg bg-gradient-to-r from-teal/10 to-orange/10 p-8 md:p-12">
        <h2 className="text-3xl font-bold mb-8 text-center">Our Values</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2 text-teal">Excellence</h3>
            <p className="text-sm text-muted-foreground">
              We strive for excellence in everything we do, delivering exceptional
              results that exceed expectations.
            </p>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2 text-orange">Innovation</h3>
            <p className="text-sm text-muted-foreground">
              We embrace innovation and stay ahead of industry trends to provide
              cutting-edge solutions.
            </p>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2 text-forest">Partnership</h3>
            <p className="text-sm text-muted-foreground">
              We build lasting partnerships based on trust, transparency, and
              mutual success.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
