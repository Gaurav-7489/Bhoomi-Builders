import { expect, test } from "@playwright/test";
import { skipIntro, submissionsFor, uniqueEmail } from "./helpers";

test.beforeEach(async ({ page }) => skipIntro(page));

test.describe("contact form", () => {
  test("validates required fields without sending", async ({ page }) => {
    let posted = false;
    page.on("request", (r) => {
      if (r.url().endsWith("/api/contact")) posted = true;
    });
    await page.goto("/contact");
    await page.getByRole("button", { name: "Submit" }).click();
    for (const label of ["Name", "Email", "Phone Number", "Message"]) {
      await expect(page.getByRole("textbox", { name: label, exact: true })).toHaveAttribute("aria-invalid", "true");
    }
    await expect(page.getByText("Please enter your name.")).toBeVisible();
    await expect(page.getByRole("textbox", { name: "Name", exact: true })).toBeFocused();
    expect(posted).toBe(false);
  });

  test("shows pending, then success once the endpoint accepts", async ({ page }) => {
    const email = uniqueEmail("contact");
    await page.goto("/contact");
    await page.getByRole("textbox", { name: "Name", exact: true }).fill("Asha Kumar");
    await page.getByRole("textbox", { name: "Email", exact: true }).fill(email);
    await page.getByRole("textbox", { name: "Phone Number", exact: true }).fill("+91 98450 12345");
    await page.getByRole("textbox", { name: "Message", exact: true }).fill("We’d like help redesigning a three-bedroom apartment.");
    await page.getByRole("button", { name: "Submit" }).click();

    await expect(page.getByRole("button", { name: /Sending/ })).toBeDisabled();
    await expect(page.getByText(/your message is/)).toBeVisible();
    await expect(page.getByText(/with us/)).toBeVisible();

    const received = await submissionsFor(email);
    expect(received).toHaveLength(1);
    expect(received[0].endpoint).toBe("contact");
    expect(received[0].body).toMatchObject({
      type: "contact",
      name: "Asha Kumar",
      email,
      phone: "+91 98450 12345",
      message: "We’d like help redesigning a three-bedroom apartment.",
    });

    await page.getByRole("button", { name: "Send another message" }).click();
    await expect(page.getByRole("textbox", { name: "Name", exact: true })).toHaveValue("");
  });

  test("shows an error and keeps input when the endpoint fails", async ({ page }) => {
    await page.goto("/contact");
    await page.getByRole("textbox", { name: "Name", exact: true }).fill("Fail Case");
    await page.getByRole("textbox", { name: "Email", exact: true }).fill("fail@example.com");
    await page.getByRole("textbox", { name: "Phone Number", exact: true }).fill("+91 90000 00000");
    await page.getByRole("textbox", { name: "Message", exact: true }).fill("This one should be rejected by the mock.");
    await page.getByRole("button", { name: "Submit" }).click();

    await expect(page.getByText(/Something went wrong sending your message/)).toBeVisible();
    await expect(page.getByText(/with us/)).toHaveCount(0);
    await expect(page.getByRole("textbox", { name: "Message", exact: true })).toHaveValue("This one should be rejected by the mock.");
    await expect(page.getByRole("button", { name: "Submit" })).toBeEnabled();
  });

  test("server rejects invalid payloads with field errors", async ({ request }) => {
    const res = await request.post("/api/contact", { data: { name: "A", email: "nope", phone: "x", message: "" } });
    expect(res.status()).toBe(422);
    const body = await res.json();
    expect(Object.keys(body.fieldErrors).sort()).toEqual(["email", "message", "name", "phone"]);
  });
});

test.describe("newsletter", () => {
  test("subscribes and confirms after the endpoint accepts", async ({ page }) => {
    const email = uniqueEmail("news");
    await page.goto("/");
    const footer = page.locator("footer");
    await footer.getByLabel("Email address").fill(email);
    await footer.getByRole("button", { name: "Subscribe" }).click();
    await expect(footer.getByRole("button", { name: "Subscribe" })).toBeDisabled();
    await expect(footer.getByText("Thank you — you’re on the list.")).toBeVisible();
    const received = await submissionsFor(email);
    expect(received).toHaveLength(1);
    expect(received[0].endpoint).toBe("newsletter");
  });

  test("shows validation and delivery errors", async ({ page }) => {
    await page.goto("/services");
    const footer = page.locator("footer");
    await footer.getByLabel("Email address").fill("not-an-email");
    await footer.getByRole("button", { name: "Subscribe" }).click();
    await expect(footer.getByText("Please enter a valid email address.")).toBeVisible();

    await footer.getByLabel("Email address").fill("fail@example.com");
    await footer.getByRole("button", { name: "Subscribe" }).click();
    await expect(footer.getByText(/Something went wrong/)).toBeVisible();
    await expect(footer.getByText(/on the list/)).toHaveCount(0);
  });
});
