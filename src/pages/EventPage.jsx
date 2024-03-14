import React from "react";
import { formatDate, handleChange } from "../Functions";
import {
  Card,
  FormLabel,
  Input,
  Select,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  CardHeader,
  Heading,
  CardBody,
  Stack,
  FormControl,
  Checkbox,
  FormHelperText,
  Text,
  Box,
  Image,
  Flex,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import { useState } from "react";
import { useToast } from "@chakra-ui/react";
import { useLoaderData, useNavigate } from "react-router-dom";

export const Loader = async ({ params }) => {
  const users = await fetch("http://localhost:3000/users");
  const event = await fetch(`http://localhost:3000/events/?id=${params.eventId}`);
  const categories = await fetch(`http://localhost:3000/categories`);

  return {
    users: await users.json(),
    eventData: await event.json(),
    categories: await categories.json(),
  };
};

export const EventPage = () => {
  const { users, eventData, categories } = useLoaderData();
  const event = eventData[0];
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigator = useNavigate();
  const [formData, setFormData] = useState({
    id: event.id,
    createdBy: event.createdBy,
    title: event.title,
    description: event.description,
    image: event.image,
    categoryIds: event.categoryIds,
    location: event.location,
    startTime: event.startTime,
    endTime: event.endTime,
  });

  const { isOpen: isDeleteOpen, onOpen: onOpenDelete, onClose: onCloseDelete } = useDisclosure();

  const handleDeleteEventModal = () => {
    onOpenDelete();
  };

  const startTime = formatDate(event.startTime);
  const endTime = formatDate(event.endTime);

  const filterEventCategories = (categoryIds) => {
    return categories.filter((category) => {
      return categoryIds.includes(category.id);
    });
  };
  const eventCategories = filterEventCategories(event.categoryIds);

  const findCreatorEvent = () => {
    return users.filter((user) => {
      return user.id === event.createdBy;
    });
  };

  const createdBy = findCreatorEvent()[0];

  const handleUserChange = (userId) => {
    setFormData({ ...formData, createdBy: userId });
  };

  const handleCheckboxChange = (categoryId) => {
    const updatedCategoryIds = formData.categoryIds.includes(categoryId)
      ? formData.categoryIds.filter((id) => id !== categoryId)
      : [...formData.categoryIds, categoryId];

    setFormData({ ...formData, categoryIds: updatedCategoryIds });
  };

  const confirmDeleteEvent = async () => {
    try {
      const response = await fetch(`http://localhost:3000/events/${formData.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        onCloseDelete();
        navigator("/");
        toast({
          title: "Event deleted",
          description: "Your event has been successfully deleted!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        throw new Error("Failed to delete event try again");
      }
    } catch (error) {
      toast({
        title: "An error occurred",
        description: "Failed to delete event try again",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleEventUpdate = async (e) => {
    e.preventDefault();
    try {
      if (formData.categoryIds.length === 0) {
        throw new Error("At least one category must be selected.");
      }

      const response = await fetch(`http://localhost:3000/events/${formData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        navigator("/");
        toast({
          title: "Event updated",
          description: "Your event has been successfully updated!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        throw new Error("Failed to update event");
      }
    } catch (error) {
      console.error("Error updating event:", error.message);
      toast({
        title: "An error occurred",
        description: "Failed to update event",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex
      width="100%"
      padding="1rem"
      flexDirection="column"
      justifyContent="center"
      minHeight="100vh"
      alignItems="center">
      <Card minWidth={{ base: "100%", md: "800px" }} maxWidth={"800px"}>
        <CardHeader padding={"0.75rem"}>
          <Box
            borderRadius={"lg"}
            backgroundImage={`url(${event.image})`}
            backgroundSize="cover"
            backgroundPosition="center"
            height={"250px"}></Box>
        </CardHeader>
        <CardBody
          display={"flex"}
          justifyContent={"center"}
          padding={"1rem"}
          alignItems={"center"}
          textAlign={"center"}>
          <Stack spacing={"1rem"}>
            <Heading marginBottom={"0.5rem"} fontSize={"2rem"}>
              {event.title}
            </Heading>
            <Box display={"flex"} flexWrap={"wrap"} justifyContent={"center"} gap={"5px"}>
              <Text fontSize={"1.25rem"} fontWeight={"500"}>
                Categories:{" "}
              </Text>
              {eventCategories ? (
                eventCategories.map((category) => (
                  <Text fontSize={"1.25rem"} key={category.id}>
                    {category.name}
                  </Text>
                ))
              ) : (
                <Text fontWeight={"500"}>No categories found</Text>
              )}
            </Box>
            <Text fontSize={"1.25rem"}>
              <Text fontSize={"1.25rem"} fontWeight={"500"} as={"span"}>
                Description:
              </Text>{" "}
              {event.description}
            </Text>

            <Box display={"flex"} alignItems={"center"} justifyContent={"center"} gap={"1rem"}>
              <Text>Created by: {createdBy.name}</Text>
              <Image height={"60px"} borderRadius={"10px"} src={createdBy.image} />
            </Box>
            <Box display={"flex"} justifyContent={"center"} gap={"1rem"}>
              <Text fontWeight={"500"} fontSize={"1rem"}>
                Starts: {startTime}
              </Text>
              <Text fontWeight={"500"} fontSize={"1rem"}>
                Ends: {endTime}
              </Text>
            </Box>
            <Button onClick={onOpen}>Edit event</Button>
            <Button onClick={handleDeleteEventModal} colorScheme="red">
              Delete event
            </Button>
          </Stack>
        </CardBody>
      </Card>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit event</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box as={"form"}>
              <Stack height={"100%"} spacing={"0.5rem"}>
                <FormControl id="title" isRequired>
                  <FormLabel>Title</FormLabel>
                  <Input
                    variant={"filled"}
                    name="title"
                    value={formData.title}
                    onChange={(e) => handleChange(e, formData, setFormData)}
                  />
                </FormControl>
                <FormControl id="description" isRequired>
                  <FormLabel>Description</FormLabel>
                  <Input
                    variant={"filled"}
                    name="description"
                    value={formData.description}
                    onChange={(e) => handleChange(e, formData, setFormData)}
                  />
                </FormControl>
                <FormControl id="image" isRequired>
                  <FormLabel>Image URL</FormLabel>
                  <Input
                    variant={"filled"}
                    name="image"
                    value={formData.image}
                    onChange={(e) => handleChange(e, formData, setFormData)}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>User</FormLabel>
                  <Select
                    placeholder="Select user"
                    value={formData.createdBy}
                    onChange={(e) => handleUserChange(e.target.value)}>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name}
                      </option>
                    ))}
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel>Categories</FormLabel>
                  <Stack spacing={3}>
                    {categories.map((category) => (
                      <Checkbox
                        key={category.id}
                        isChecked={formData.categoryIds.includes(category.id)}
                        onChange={() => handleCheckboxChange(category.id)}>
                        {category.name}
                      </Checkbox>
                    ))}
                  </Stack>
                  <FormHelperText>Choose a category</FormHelperText>
                </FormControl>
                <FormControl id="location" isRequired>
                  <FormLabel>Location</FormLabel>
                  <Input
                    variant={"filled"}
                    name="location"
                    value={formData.location}
                    onChange={(e) => handleChange(e, formData, setFormData)}
                  />
                </FormControl>
                <FormControl id="startTime" isRequired>
                  <FormLabel>Start Time</FormLabel>
                  <Input
                    type="datetime-local"
                    name="startTime"
                    value={formData.startTime}
                    onChange={(e) => handleChange(e, formData, setFormData)}
                  />
                </FormControl>
                <FormControl id="endTime" isRequired>
                  <FormLabel>End Time</FormLabel>
                  <Input
                    type="datetime-local"
                    name="endTime"
                    value={formData.endTime}
                    onChange={(e) => handleChange(e, formData, setFormData)}
                  />
                </FormControl>
              </Stack>
            </Box>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button onClick={handleEventUpdate} variant="ghost">
              Confirm edit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal isCentered isOpen={isDeleteOpen} onClose={onCloseDelete}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Are you sure you want to delete this event</ModalHeader>
          <ModalCloseButton />
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onCloseDelete}>
              Cancel
            </Button>
            <Button colorScheme="red" onClick={confirmDeleteEvent}>
              Confirm Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
};
