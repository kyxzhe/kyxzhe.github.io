import { ImageResponse } from "next/og";
import { siteMetadata } from "@/lib/seo/config";

export const dynamic = "force-static";
export const alt = siteMetadata.ogImageAlt;
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          background:
            "linear-gradient(135deg, #f4efe7 0%, #f7f6f2 42%, #d7e5e8 100%)",
          color: "#101010",
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -120,
            right: -80,
            width: 420,
            height: 420,
            borderRadius: 9999,
            background: "rgba(16, 16, 16, 0.08)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -110,
            left: -60,
            width: 300,
            height: 300,
            borderRadius: 9999,
            background: "rgba(93, 129, 134, 0.18)",
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            padding: "64px 72px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              fontSize: 24,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "rgba(16, 16, 16, 0.68)",
            }}
          >
            <div
              style={{
                width: 56,
                height: 2,
                background: "rgba(16, 16, 16, 0.36)",
              }}
            />
            Kevin Zheng
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 900 }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
                fontSize: 74,
                lineHeight: 1,
                fontWeight: 700,
                letterSpacing: 0,
              }}
            >
              <div>Trustworthy</div>
              <div>Machine Learning</div>
            </div>
            <div
              style={{
                display: "flex",
                maxWidth: 760,
                fontSize: 30,
                lineHeight: 1.35,
                color: "rgba(16, 16, 16, 0.76)",
              }}
            >
              Information diffusion, social data science, and robust ML research from Sydney.
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
                fontSize: 24,
                color: "rgba(16, 16, 16, 0.72)",
              }}
            >
              <div>{siteMetadata.affiliations.current}</div>
              <div>{siteMetadata.baseUrl.replace(/^https?:\/\//, "")}</div>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 104,
                height: 104,
                borderRadius: 9999,
                border: "1px solid rgba(16, 16, 16, 0.18)",
                fontSize: 34,
                fontWeight: 700,
                letterSpacing: 0,
              }}
            >
              KZ
            </div>
          </div>
        </div>
      </div>
    ),
    size
  );
}
