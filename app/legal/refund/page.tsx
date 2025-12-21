import { themeLibrary, ThemeName } from '@/lib/designSystem'

const REFUND_THEME: ThemeName = 'twilight'

const REFUND_TEXT = String.raw`
Payment Terms and Refund Policy
https://discoverwhoami.com at Divine Wisdom

1. The User shall be entitled to use User's valid credit/debit cards, online/net banking facility, tele banking facility to make payment for the Subscription Fee for the The User shall be bound to use User's own credit/debit cards, online banking accounts to make any payment. The User undertakes and confirms that you would furnish correct, complete and accurate detail of credit/debit cards, online banking accounts and shall be solely responsible for any cost, expense, loss and/or damage which the User may suffer due to furnishing of wrong detail/information relating to your credit/debit cards or online banking accounts.

2. Divine Wisdom confirms that the details provided by the User in this regard shall be kept confidential and shall not be disclosed to any third-party except to the extent required under the rules of any stock exchange and/or by applicable laws, regulations and/or processes of any government authority and/or in connection with any judicial process regarding any legal action, suit and/or proceeding arising out of and/or relating to this Agreement and/or relating to provision of Services by Divine Wisdom . The details provided by the User shall be retained after your access to Services has been cancelled or withdrawn, in compliance with the IT Intermediary Rules and/or any applicable laws.

3. The User here represents and acknowledges that all payments made by the User to Divine Wisdom shall be strictly on a non-refundable basis and the Subscription Fees paid by a User towards the Services are non – refundable and non-transferable subject to Clause 8.4.

4. Divine Wisdom may remove any Digital Content and/or Third Party Content and/or User Content, if the same is not in compliance with applicable laws. In the event, the Digital Content has been subscribed by any User and the same has been removed due to its non-adherence with standards as set out under applicable laws, the User shall be refunded the pro rata proportion of the Subscription Fees, if only a part of the Digital Content has been removed and in the event, the entire Digital Content is not available for the User, entire Subscription Fees shall be refunded to the User within a period of 10 (ten) days of removal of the Digital Content or any part thereof.

5. Divine Wisdom shall take all reasonable precautions to protect the information provided by the User. However, it is expressly provided and accepted by the User that Divine Wisdom shall not be responsible in any manner whatsoever for any third party action which results in the information provided by the User being exposed, misused and/or fraudulently misused in any manner whatsoever by such third- party.

6. The User acknowledges that the User is accessing the Digital Content at their free will and Divine Wisdom does not own the User Content and the Third Party Content.

Cancellation and Refund Policy

The Course fees once paid is not refundable, so you should consider carefully whether or not you would like to enroll for the Course.

Note: this is an online course and once your payment has been received, you will have access to all the Course Materials through your Account on the website.

Shipping and Delivery Policy

You will be given access to your Course Materials once your payment has been received. You may access it by logging into your Account on the website
`

const HIGHLIGHT_TERMS = [
  'Payment Terms and Refund Policy',
  'Divine Wisdom',
  'User',
  'Subscription Fee',
  'Digital Content',
  'Third Party Content',
  'User Content',
  'IT Intermediary Rules',
  'Cancellation and Refund Policy',
  'Shipping and Delivery Policy',
  'Course Materials'
]

function highlightText(input: string) {
  return HIGHLIGHT_TERMS.reduce(
    (current, term) => current.replaceAll(term, `<strong>${term}</strong>`),
    input
  )
}

const PARAGRAPHS = REFUND_TEXT.split('\n\n').filter(Boolean)

export const metadata = { title: 'Payment & Refund Policy - Discover Who Am I' }

export default function RefundPolicyPage() {
  const palette = themeLibrary[REFUND_THEME].classes
  const headingClass = palette.card.title

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-sky-100 bg-white/95 p-8 text-center shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-sky-400">Legal</p>
        <h1 className={`mt-2 text-3xl font-semibold tracking-tight ${headingClass}`}>Payment & Refund Policy</h1>
        <a
          href="https://discoverwhoami.com/"
          className="mt-3 inline-block text-lg font-semibold text-sky-600 underline decoration-sky-400 hover:text-sky-700"
        >
          https://discoverwhoami.com/
        </a>
        <p className={`mt-2 text-base leading-7 ${palette.muted}`}>
          Payment Terms and Refund Policy for{' '}
          <a href="https://discoverwhoami.com/" className="font-semibold text-sky-600 underline decoration-sky-400">
            https://discoverwhoami.com/
          </a>{' '}
          at <span className="font-semibold">Divine Wisdom</span>
        </p>
      </section>
      <section className="rounded-3xl border border-sky-100 bg-white/95 p-8 text-base leading-7 text-sky-800 shadow-sm">
        <div className="space-y-4">
          {PARAGRAPHS.map((paragraph, index) => (
            // eslint-disable-next-line react/no-danger
            <p key={index} dangerouslySetInnerHTML={{ __html: highlightText(paragraph) }} />
          ))}
        </div>
      </section>
    </div>
  )
}
