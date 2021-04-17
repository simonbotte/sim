<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\ORM\EntityManagerInterface;
use App\Repository\PostRepository;
use App\Entity\Post;

class AdminController extends AbstractController
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
     * @Route("/admin/post", name="admin_index", methods={"GET"})
     */
    public function camera_index(PostRepository $postRepository ): Response
    {
      $posts = $postRepository->findAll();
      
      return $this->render('admin/post.html.twig', [
        'posts' => $posts
      ]);
    }
}
