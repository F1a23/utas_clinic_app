import * as yup from "yup";

export const announcementSchemaValidation = yup.object().shape({
  title: yup.string().required("Title is required"),
  description: yup.string().required("Description is required"),
  mediaType: yup
    .string()
    .oneOf(["image", "video"])
    .required("Media type is required"),
  media: yup.mixed().required("Media file is required"),
});
