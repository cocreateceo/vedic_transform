INSTRUCTIONS FOLDER
==================

Place your welcome PDF file here.

Default expected filename: welcome-guide.pdf

This PDF will be sent as an attachment to new users when they register.

To change the filename or path, edit:
  src/config/site.config.ts -> welcomePdf.path

Example:
  welcomePdf: {
    enabled: true,
    path: "/instructions/welcome-guide.pdf",
    attachmentName: "10X-Vedic-Transformation-Guide.pdf",
  }
