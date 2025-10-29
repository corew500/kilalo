'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Card } from '@/components/ui/card'
import imageUrlBuilder from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'
import { client } from '@/sanity/lib/client'

const builder = imageUrlBuilder(client)

function urlFor(source: SanityImageSource) {
  return builder.image(source)
}

type SanityImageWithAlt = SanityImageSource & { alt?: string }

interface TeamMember {
  _id: string
  name: string
  role: string
  bio: string
  photo?: SanityImageWithAlt
  expertise?: string[]
  socialLinks?: {
    linkedin?: string
    twitter?: string
  }
}

interface TeamGridProps {
  members: TeamMember[]
}

export function TeamGrid({ members }: TeamGridProps) {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null)

  return (
    <>
      <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4">
        {members.map((member) => (
          <Card
            key={member._id}
            className="group cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-xl"
            onClick={() => setSelectedMember(member)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                setSelectedMember(member)
              }
            }}
            tabIndex={0}
            role="button"
            aria-label={`View profile of ${member.name}, ${member.role}`}
          >
            {member.photo && (
              <div className="relative aspect-square overflow-hidden bg-muted">
                <Image
                  src={urlFor(member.photo).width(400).height(400).url()}
                  alt={member.photo.alt || member.name}
                  width={400}
                  height={400}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </div>
            )}
            <div className="p-4">
              <h3 className="text-lg font-semibold">{member.name}</h3>
              <p className="text-sm text-muted-foreground">{member.role}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Modal Dialog */}
      <Dialog open={!!selectedMember} onOpenChange={() => setSelectedMember(null)}>
        <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto">
          {selectedMember && (
            <>
              <DialogHeader>
                <div className="flex items-start gap-6">
                  {selectedMember.photo && (
                    <div className="h-24 w-24 shrink-0 overflow-hidden rounded-full">
                      <Image
                        src={urlFor(selectedMember.photo).width(200).height(200).url()}
                        alt={selectedMember.name}
                        width={200}
                        height={200}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <DialogTitle className="mb-1 text-2xl">{selectedMember.name}</DialogTitle>
                    <p className="text-muted-foreground">{selectedMember.role}</p>

                    {/* Social Links */}
                    {selectedMember.socialLinks && (
                      <div className="mt-3 flex gap-3">
                        {selectedMember.socialLinks.linkedin && (
                          <a
                            href={selectedMember.socialLinks.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground transition-colors hover:text-teal"
                          >
                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                            </svg>
                          </a>
                        )}
                        {selectedMember.socialLinks.twitter && (
                          <a
                            href={selectedMember.socialLinks.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground transition-colors hover:text-teal"
                          >
                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
                            </svg>
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </DialogHeader>

              <div className="mt-6 space-y-6">
                {/* Bio */}
                <div>
                  <p className="leading-relaxed text-muted-foreground">{selectedMember.bio}</p>
                </div>

                {/* Expertise Tags */}
                {selectedMember.expertise && selectedMember.expertise.length > 0 && (
                  <div>
                    <h4 className="mb-3 font-semibold">Expertise</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedMember.expertise.map((skill, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center rounded-full bg-teal/10 px-3 py-1 text-sm font-medium text-teal"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
