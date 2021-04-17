<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\Post;

class CameraController extends AbstractController
{
    /**
     * @var EntityManagerInterface
     */
    private $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
        
    }

    /**
     * @Route("/camera", name="camera_index", methods={"GET"})
     */
    public function camera_index(): Response
    {
      return $this->render('camera/index.html.twig', []);
    }

    /**
     * @Route("/camera", name="camera_post", methods={"POST"})
     */
    public function camera_post(): Response
    {
      $post = new Post;
      $post->setImage($_POST['img']);
      $post->setLatitude($_POST['lat']);
      $post->setLongitude($_POST['lon']);
      $post->setIdUser($this->getUser());
      $post->setDescription('Description');
      
      $this->entityManager->persist($post);
      $this->entityManager->flush();
      return new Response(
        'POST ADDED', 
        Response::HTTP_OK
      );
    }
}
