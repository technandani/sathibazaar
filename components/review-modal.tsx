"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

type ReviewModalProps = {
  onSubmit: (rating: number, comment: string) => void
}

export default function ReviewModal({ onSubmit }: ReviewModalProps) {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState("")

  const handleSubmit = () => {
    if (rating === 0) {
      alert("Please select a star rating.")
      return
    }
    onSubmit(rating, comment)
    setRating(0)
    setComment("")
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="rating">Rating</Label>
        <div className="flex gap-1" id="rating">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={cn(
                "h-8 w-8 cursor-pointer transition-colors",
                (hoverRating || rating) >= star ? "text-yellow-400 fill-yellow-400" : "text-gray-300",
              )}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
            />
          ))}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="comment">Comment (Optional)</Label>
        <Textarea
          id="comment"
          placeholder="Share your feedback..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
        />
      </div>
      <Button onClick={handleSubmit} className="w-full" disabled={rating === 0}>
        Submit Review
      </Button>
    </div>
  )
}
