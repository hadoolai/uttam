/**
 * HadoolAI - Automatic Viewer Reviews & Comments System
 * Production Vanilla JS Widget for static HTML articles
 * Connects to /api/reviews (Netlify Functions / Supabase)
 */
(function () {
  const RATING_DESCRIPTIONS = {
    5: '5 stars - Excellent, highly recommend',
    4: '4 stars - Very good, helpful information',
    3: '3 stars - Average, room for improvement',
    2: '2 stars - Below expectations',
    1: '1 star - Disappointing or unhelpful',
  };

  function escapeHTML(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function getHelpfulStorage() {
    try {
      const saved = localStorage.getItem('hadool_helpful_reviews');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  }

  function saveHelpfulStorage(data) {
    try {
      localStorage.setItem('hadool_helpful_reviews', JSON.stringify(data));
    } catch {}
  }

  function initViewerReviews(container) {
    let slug = container.getAttribute('data-article-slug');
    if (!slug) {
      const path = window.location.pathname.replace(/\/$/, '');
      const parts = path.split('/');
      slug = (parts[parts.length - 1] || 'general').replace(/\.html$/, '');
    }
    slug = slug.trim().toLowerCase();

    let state = {
      reviews: [],
      summary: { total_reviews: 0, average_rating: 0, distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } },
      page: 1,
      hasMore: false,
      selectedRating: 0,
      hoverRating: 0,
      isLoading: true,
      isLoadingMore: false,
      isSubmitting: false,
      submitSuccess: null,
      submitError: null,
    };

    function renderStars(rating, size = 16) {
      let starsHtml = '';
      for (let i = 1; i <= 5; i++) {
        const isFilled = i <= Math.round(rating);
        starsHtml += `
          <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="${isFilled ? '#f59e0b' : 'none'}" stroke="${isFilled ? '#f59e0b' : '#cbd5e1'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:middle; margin-right:2px;">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
        `;
      }
      return starsHtml;
    }

    function render() {
      const helpfulData = getHelpfulStorage();
      const currentStar = state.hoverRating || state.selectedRating;
      const desc = currentStar > 0 ? RATING_DESCRIPTIONS[currentStar] : 'Click a star to rate (1–5)';

      let summaryHtml = '';
      if (state.summary.total_reviews > 0) {
        let barsHtml = '';
        [5, 4, 3, 2, 1].forEach((s) => {
          const count = state.summary.distribution[s] || 0;
          const pct = state.summary.total_reviews > 0 ? (count / state.summary.total_reviews) * 100 : 0;
          barsHtml += `
            <div style="display:flex; align-items:center; gap:8px; font-size:12px; margin-bottom:4px;">
              <span style="width:28px; font-weight:700; color:#334155;">${s}★</span>
              <div style="flex:1; background:#e2e8f0; height:8px; border-radius:4px; overflow:hidden;">
                <div style="background:#f59e0b; width:${pct}%; height:100%; border-radius:4px; transition:width 0.3s ease;"></div>
              </div>
              <span style="width:30px; text-align:right; color:#64748b; font-weight:600;">${count}</span>
            </div>
          `;
        });

        summaryHtml = `
          <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:16px; padding:20px; margin-bottom:24px; display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:20px; align-items:center;">
            <div style="text-align:center; border-right:1px solid #e2e8f0; padding-right:16px;">
              <div style="font-size:42px; font-weight:900; color:#0f172a; line-height:1;">${state.summary.average_rating.toFixed(1)}</div>
              <div style="margin:8px 0;">${renderStars(state.summary.average_rating, 20)}</div>
              <div style="font-size:12px; color:#64748b; font-weight:600;">Based on ${state.summary.total_reviews} verified reader review${state.summary.total_reviews === 1 ? '' : 's'}</div>
            </div>
            <div>
              ${barsHtml}
            </div>
          </div>
        `;
      }

      let reviewsListHtml = '';
      if (state.isLoading) {
        reviewsListHtml = `<div style="text-align:center; padding:30px; color:#64748b; font-size:14px;">Loading reviews...</div>`;
      } else if (state.reviews.length === 0) {
        reviewsListHtml = `
          <div style="text-align:center; padding:36px 20px; background:#f8fafc; border:1px dashed #cbd5e1; border-radius:16px; margin-top:16px;">
            <div style="font-size:24px; margin-bottom:8px;">💬</div>
            <h4 style="margin:0 0 6px 0; font-size:16px; font-weight:700; color:#0f172a;">No reviews yet</h4>
            <p style="margin:0; font-size:13px; color:#64748b;">Be the first to share your experience, feedback, or questions about this article.</p>
          </div>
        `;
      } else {
        const cards = state.reviews
          .map((rev) => {
            const isHelpful = Boolean(helpfulData[rev.id]);
            const dateStr = new Date(rev.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            });
            return `
              <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:14px; padding:18px; margin-bottom:14px; box-shadow:0 1px 2px rgba(0,0,0,0.03);">
                <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px; flex-wrap:wrap; gap:8px;">
                  <div>
                    <div style="display:flex; align-items:center; gap:8px;">
                      <span style="font-weight:700; font-size:14px; color:#0f172a;">${escapeHTML(rev.name)}</span>
                      <span style="background:#ecfdf5; color:#047857; border:1px solid #a7f3d0; font-size:10px; font-weight:700; padding:1px 6px; border-radius:4px;">Verified Reader</span>
                    </div>
                    <div style="font-size:11px; color:#94a3b8; margin-top:2px;">${dateStr}</div>
                  </div>
                  <div>${renderStars(rev.rating, 16)}</div>
                </div>
                <p style="margin:0 0 12px 0; font-size:14px; line-height:1.6; color:#334155; white-space:pre-line;">${escapeHTML(rev.comment)}</p>
                <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid #f1f5f9; padding-top:10px;">
                  <button type="button" class="btn-helpful" data-id="${rev.id}" ${isHelpful ? 'disabled' : ''} style="background:${isHelpful ? '#ecfdf5' : '#f8fafc'}; color:${isHelpful ? '#047857' : '#475569'}; border:1px solid ${isHelpful ? '#a7f3d0' : '#e2e8f0'}; border-radius:8px; padding:4px 10px; font-size:12px; font-weight:600; cursor:${isHelpful ? 'default' : 'pointer'}; display:inline-flex; align-items:center; gap:4px;">
                    👍 Helpful (${rev.helpful_count})
                  </button>
                  <span style="font-size:11px; color:#94a3b8; font-style:italic;">Article: ${slug}</span>
                </div>
              </div>
            `;
          })
          .join('');

        reviewsListHtml = `
          <div style="margin-top:20px;">
            ${cards}
            ${
              state.hasMore
                ? `<div style="text-align:center; margin-top:16px;">
                     <button type="button" id="btn-load-more" style="background:#f8fafc; border:1px solid #cbd5e1; color:#0f172a; padding:8px 18px; border-radius:10px; font-size:13px; font-weight:700; cursor:pointer;">
                       ${state.isLoadingMore ? 'Loading More Reviews...' : 'Load More Reviews'}
                     </button>
                   </div>`
                : ''
            }
          </div>
        `;
      }

      container.innerHTML = `
        <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:24px; padding:28px; margin:40px 0 24px 0; font-family:inherit; box-shadow:0 1px 3px rgba(0,0,0,0.04);">
          <!-- Header -->
          <div style="border-bottom:1px solid #e2e8f0; padding-bottom:18px; margin-bottom:24px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
            <div>
              <div style="color:#4f46e5; font-size:11px; font-weight:800; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:4px;">Community Feedback</div>
              <h3 style="margin:0; font-size:24px; font-weight:800; color:#0f172a;">Viewer Reviews & Comments</h3>
              <p style="margin:4px 0 0 0; font-size:13px; color:#64748b;">Share your experience, feedback, or opinion about this article.</p>
            </div>
            ${
              state.summary.total_reviews > 0
                ? `<div style="background:#fef3c7; border:1px solid #fde68a; border-radius:12px; padding:6px 14px; text-align:right;">
                     <span style="font-size:18px; font-weight:900; color:#92400e;">${state.summary.average_rating.toFixed(1)} ★</span>
                     <div style="font-size:10px; font-weight:700; color:#92400e;">${state.summary.total_reviews} Reviews</div>
                   </div>`
                : ''
            }
          </div>

          <!-- Summary if exists -->
          ${summaryHtml}

          <!-- Review Form -->
          <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:16px; padding:22px; margin-bottom:28px;">
            <h4 style="margin:0 0 4px 0; font-size:16px; font-weight:700; color:#0f172a;">Write Your Review</h4>
            <p style="margin:0 0 16px 0; font-size:12px; color:#64748b;">All reviews are moderated before publishing to ensure constructive discussions.</p>

            ${
              state.submitSuccess
                ? `<div style="background:#ecfdf5; border:1px solid #a7f3d0; color:#065f46; padding:12px 16px; border-radius:10px; font-size:13px; margin-bottom:16px;">
                     <strong>Thank you!</strong> ${escapeHTML(state.submitSuccess)}
                   </div>`
                : ''
            }
            ${
              state.submitError
                ? `<div style="background:#fef2f2; border:1px solid #fecaca; color:#991b1b; padding:12px 16px; border-radius:10px; font-size:13px; margin-bottom:16px;">
                     ${escapeHTML(state.submitError)}
                   </div>`
                : ''
            }

            <form id="form-submit-review" style="display:grid; gap:16px;">
              <!-- Honeypot -->
              <input type="text" name="website_url_hp" style="display:none;" tabindex="-1" autocomplete="off" />

              <div>
                <label style="display:block; font-size:11px; font-weight:700; text-transform:uppercase; color:#334155; margin-bottom:6px;">Your Name *</label>
                <input type="text" id="review-name-input" required maxlength="60" placeholder="e.g., Jane Smith" style="width:100%; box-sizing:border-box; background:#ffffff; border:1px solid #cbd5e1; border-radius:10px; padding:10px 14px; font-size:14px; color:#0f172a;" />
              </div>

              <div>
                <label style="display:block; font-size:11px; font-weight:700; text-transform:uppercase; color:#334155; margin-bottom:6px;">Your Rating *</label>
                <div style="display:flex; align-items:center; gap:12px; flex-wrap:wrap;">
                  <div id="star-picker" style="background:#ffffff; border:1px solid #cbd5e1; border-radius:10px; padding:6px 10px; display:inline-flex; gap:4px; cursor:pointer;">
                    ${[1, 2, 3, 4, 5]
                      .map((s) => {
                        const isFilled = s <= currentStar;
                        return `
                          <span class="star-btn" data-star="${s}" style="display:inline-block; padding:2px; font-size:22px; line-height:1; color:${isFilled ? '#f59e0b' : '#cbd5e1'}; user-select:none;">
                            ★
                          </span>
                        `;
                      })
                      .join('')}
                  </div>
                  <span style="font-size:12px; font-weight:600; color:#475569;">${desc}</span>
                </div>
              </div>

              <div>
                <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
                  <label style="font-size:11px; font-weight:700; text-transform:uppercase; color:#334155;">Your Review *</label>
                  <span id="comment-counter" style="font-size:11px; color:#94a3b8;">0 / 2,000</span>
                </div>
                <textarea id="review-comment-input" required rows="4" maxlength="2000" placeholder="What did you think of this article? Share your constructive critique or feedback..." style="width:100%; box-sizing:border-box; background:#ffffff; border:1px solid #cbd5e1; border-radius:10px; padding:10px 14px; font-size:14px; color:#0f172a; resize:vertical; min-height:80px;"></textarea>
                <div style="font-size:11px; color:#94a3b8; margin-top:4px;">Minimum 10 characters. Plain text only.</div>
              </div>

              <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
                <span style="font-size:11px; color:#94a3b8;">No email or phone required. Data stored securely in Supabase.</span>
                <button type="submit" id="btn-submit-review" ${state.isSubmitting ? 'disabled' : ''} style="background:#4f46e5; color:#ffffff; border:none; padding:10px 22px; border-radius:10px; font-size:13px; font-weight:700; cursor:${state.isSubmitting ? 'not-allowed' : 'pointer'};">
                  ${state.isSubmitting ? 'Submitting Review...' : 'Submit Review'}
                </button>
              </div>
            </form>
          </div>

          <!-- Reviews Section -->
          <div>
            <h4 style="margin:0 0 14px 0; font-size:16px; font-weight:700; color:#0f172a;">Reader Reviews</h4>
            ${reviewsListHtml}
          </div>
        </div>
      `;

      attachEvents();
    }

    function attachEvents() {
      // Star click and hover
      const starPicker = container.querySelector('#star-picker');
      if (starPicker) {
        starPicker.querySelectorAll('.star-btn').forEach((btn) => {
          const starVal = parseInt(btn.getAttribute('data-star'), 10);
          btn.addEventListener('click', () => {
            state.selectedRating = starVal;
            state.hoverRating = 0;
            render();
          });
          btn.addEventListener('mouseenter', () => {
            state.hoverRating = starVal;
            render();
          });
        });
        starPicker.addEventListener('mouseleave', () => {
          state.hoverRating = 0;
          render();
        });
      }

      // Comment char counter
      const commentInput = container.querySelector('#review-comment-input');
      const counter = container.querySelector('#comment-counter');
      if (commentInput && counter) {
        commentInput.addEventListener('input', () => {
          counter.textContent = `${commentInput.value.length} / 2,000`;
        });
      }

      // Form submit
      const form = container.querySelector('#form-submit-review');
      if (form) {
        form.addEventListener('submit', async (e) => {
          e.preventDefault();
          state.submitError = null;
          state.submitSuccess = null;

          const nameInput = container.querySelector('#review-name-input');
          const commentInput = container.querySelector('#review-comment-input');
          const hpInput = form.querySelector('input[name="website_url_hp"]');

          const nameVal = nameInput ? nameInput.value.trim() : '';
          const commentVal = commentInput ? commentInput.value.trim() : '';
          const hpVal = hpInput ? hpInput.value.trim() : '';

          if (!nameVal || nameVal.length < 2) {
            state.submitError = 'Name must be at least 2 characters.';
            render();
            return;
          }
          if (!state.selectedRating || state.selectedRating < 1 || state.selectedRating > 5) {
            state.submitError = 'Please select a star rating between 1 and 5.';
            render();
            return;
          }
          if (!commentVal || commentVal.length < 10) {
            state.submitError = 'Review comment must be at least 10 characters.';
            render();
            return;
          }

          state.isSubmitting = true;
          render();

          try {
            const res = await fetch('/api/reviews', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                article_slug: slug,
                name: nameVal,
                rating: state.selectedRating,
                comment: commentVal,
                honeypot: hpVal || undefined,
              }),
            });

            const data = await res.json();
            if (!res.ok) {
              throw new Error(data.error || 'Failed to submit review.');
            }

            state.submitSuccess = data.message || 'Thank you! Your review has been submitted and is waiting for approval.';
            state.selectedRating = 0;
            state.hoverRating = 0;
          } catch (err) {
            state.submitError = err.message || 'Unable to submit review right now. Please try again.';
          } finally {
            state.isSubmitting = false;
            render();
          }
        });
      }

      // Helpful buttons
      container.querySelectorAll('.btn-helpful').forEach((btn) => {
        btn.addEventListener('click', async () => {
          const revId = btn.getAttribute('data-id');
          const helpfulData = getHelpfulStorage();
          if (helpfulData[revId]) return;

          helpfulData[revId] = true;
          saveHelpfulStorage(helpfulData);

          // Optimistically update count
          const rev = state.reviews.find((r) => r.id === revId);
          if (rev) rev.helpful_count += 1;
          render();

          try {
            await fetch('/api/reviews-helpful', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ review_id: revId, article_slug: slug }),
            });
          } catch {}
        });
      });

      // Load more button
      const loadMoreBtn = container.querySelector('#btn-load-more');
      if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
          loadReviews(state.page + 1, true);
        });
      }
    }

    async function loadReviews(pageNum = 1, append = false) {
      if (append) {
        state.isLoadingMore = true;
      } else {
        state.isLoading = true;
      }
      render();

      try {
        const res = await fetch(`/api/reviews?article=${encodeURIComponent(slug)}&page=${pageNum}&limit=10`);
        if (!res.ok) throw new Error('Failed to fetch reviews');
        const data = await res.json();

        if (append) {
          state.reviews = state.reviews.concat(data.reviews || []);
        } else {
          state.reviews = data.reviews || [];
        }
        state.summary = data.summary || state.summary;
        state.page = pageNum;
        state.hasMore = Boolean(data.pagination && data.pagination.hasMore);
      } catch (err) {
        console.error('Reviews load error:', err);
      } finally {
        state.isLoading = false;
        state.isLoadingMore = false;
        render();
      }
    }

    loadReviews(1, false);
  }

  // Auto-mount on DOM ready
  function autoMount() {
    document.querySelectorAll('#hadoolai-viewer-reviews, .hadoolai-viewer-reviews').forEach((el) => {
      if (!el.hasAttribute('data-mounted')) {
        el.setAttribute('data-mounted', 'true');
        initViewerReviews(el);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoMount);
  } else {
    autoMount();
  }
})();
